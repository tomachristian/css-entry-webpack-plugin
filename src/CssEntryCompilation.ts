import Tapable from "./interop/tapable";
import { Compiler, Compilation,
         Resolver, Loader,
         SingleEntryDependency, MultiModule, Chunk, Assets,
         AfterResolveData,
         multiEntryDependencyLocSeparator, loadersToRequestIdent } from "./interop/webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import { NormalizedOptions } from "./options";
import { EntryInfo, TaggedMultiModule, isCssEntry } from "./models";
import CssEntryPluginError from "./CssEntryPluginError";

// TODO: Add spec that it works with dynamic entry (function)
// TODO: Test when two entries share a common file and one entry is excluded (when both are multi)
// TODO: Spec for how many times a condition from options is called
/** @internal */
export default class CssEntryCompilation extends Tapable {
    private breakingChangeErrorReported = false;

    public cssEntries: Set<string> = new Set();
    public nonCssEntries: Set<string> = new Set();

    constructor(
        private options: NormalizedOptions,
        private compiler: Compiler,
        private compilation: Compilation,
        private extractTextPlugin: ExtractTextPlugin) {
        super();
    }

    /**
     * Called after the NormalModuleFactory has resolved a request.
     * @param data The data for the resolved request.
     */
    public async onNormalModuleFactoryAfterResolve(
        data: AfterResolveData): Promise<AfterResolveData> {
        if (!data.dependencies) {
            this.reportBreakingChange("Could not get 'dependencies' from AfterResolveData");
            return data;
        }

        if (!this.isEntryRequestResolve(data)) {
            return data;
        }

        let depedency = data.dependencies[0] as SingleEntryDependency;
        let entry = this.extractEntryInfo(depedency);

        if (!entry) return data;

        return await this.onEntryRequestAfterResolve(entry, data);
    }

    private isEntryRequestResolve(data: AfterResolveData): boolean {
        // Only one dependency is added for an entry module
        // See webpack/lib/Compilation.js: _addModuleChain declaration
        // RISK: Webpack can change and pass multiple SingleEntryDependency instances
        return data.dependencies.length === 1 &&
               data.dependencies[0] instanceof SingleEntryDependency;
    }

    /**
     * Extracts entry information from a given SingleEntryDependency.
     * @param dependency The SingleEntryDependency to extract the entry information from.
     * @returns The entry information or null if none could be extracted.
     */
    private extractEntryInfo(dependency: SingleEntryDependency): EntryInfo | null {
        if (typeof dependency.loc !== "string") {
            this.reportBreakingChange("Could not get 'loc' from SingleEntryDependency");
            return null;
        }

        let sep = dependency.loc.lastIndexOf(multiEntryDependencyLocSeparator);
        let name = sep === -1
            ? dependency.loc
            : dependency.loc.substr(0, sep);

        if (!name) {
            this.addWarning("Entry with no name found");
            return null;
        }

        return {
            isMulti: sep !== -1,
            name: name
        };
    }

    /**
     * Called after the NormalModuleFactory has resolved the request from an entry.
     * @param entry The entry information.
     * @param data The data for the resolved request.
     * @returns A promise that finishes after the plugin logic has finished.
     */
    private async onEntryRequestAfterResolve(
        entry: EntryInfo, data: AfterResolveData): Promise<AfterResolveData> {
        let isCssEntry = await this.isCssEntry(entry, data);

        if (!isCssEntry) {
            this.nonCssEntries.add(entry.name);
            return data;
        }

        this.cssEntries.add(entry.name);
        return this.extractCss(data);
    }

    /**
     * Checks if the css from the request of the entry should be extracted.
     * @param entryInfo The entry information.
     * @param data The data for the resolved request.
     * @returns A promise that finishes after the check logic has finished or a boolean.
     */
    private async isCssEntry(entry: EntryInfo, data: AfterResolveData): Promise<boolean> {
        // Skip if already marked as a non-CSS entry
        if (this.nonCssEntries.has(entry.name)) return false;

        // Check configuration options
        if (!this.cssEntries.has(entry.name) &&
            !this.options.includeCssEntry(entry)) return false;

        // Single entry
        if (!entry.isMulti &&
            this.options.isValidCssEntryResource(data.resource, entry)) {
            // Valid single entry with valid css resource
            return true;
        }

        // Multi entry
        if (entry.isMulti) {
            if (!this.cssEntries.has(entry.name)) {
                // This is the first time validating this entry
                return this.isMultiCssEntry(entry);
            }

            // Already validated this, it is a valid css entry
            return true;
        }

        return false;
    }

    private async isMultiCssEntry(entryInfo: EntryInfo): Promise<boolean> {
        // We do a check to see if all resources in the entry are valid css resources
        let multiModule = this.findMultiModule(entryInfo);
        if (!multiModule) {
            this.reportBreakingChange("Could not find associated MultiModule of entry");
            return false;
        }

        let resources = await this.resolveResources(multiModule);
        let hasOnlyCssResources = resources.every(resource =>
            this.options.isValidCssEntryResource(resource, entryInfo));

        let taggedModule = multiModule as TaggedMultiModule;
        taggedModule[isCssEntry] = hasOnlyCssResources;

        return hasOnlyCssResources;
    }

    private resolveResources(module: MultiModule): Promise<string[]> {
        const resolver = this.compilation.resolvers.normal,
              context = this.compiler.context;

        return Promise.all(module.dependencies
            .map(depedency => this.resolveResource(resolver, context, depedency)));
    }

    private resolveResource(resolver: Resolver, context: string,
        dependecy: SingleEntryDependency): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            resolver.resolve({}, context, dependecy.request, (err, data: string) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }

    private findMultiModule(entryInfo: EntryInfo): MultiModule | null {
        if (!entryInfo.isMulti) return null;

        for (let module of this.compilation.entries) {
            if (module instanceof MultiModule &&
                module.name === entryInfo.name) {
                return module;
            }
        }

        return null;
    }

    private extractCss(data: AfterResolveData): AfterResolveData {
        const originalLoaders = data.loaders;
        data.loaders = this.extractTextPlugin.extract({
            use: originalLoaders
        });

        // Recalculate the 'request', this is required
        data.request = loadersToRequestIdent(data.loaders, data.resource);

        return data;
    }

    /**
     * Called after the sealing of the compilation.
     * @param callback The callback to call when ready.
     * @see https://github.com/webpack/docs/wiki/plugins#seal
     */
    public async onCompilationAfterSeal(): Promise<void> {
        this.fixMissingCssEntries();
        this.alterCssChunks(this.compilation.assets, this.compilation.chunks);
    }

    private fixMissingCssEntries(): void {
        let allEntryNames = Object.keys(this.compilation.entrypoints);

        for (let name of allEntryNames) {
            if (this.cssEntries.has(name)) continue;

            let entrypoint = this.compilation.entrypoints[name];
            let hasOnlyCssModules = entrypoint.chunks.every(chunk => {
                let taggedModule = chunk.entryModule as TaggedMultiModule;
                return taggedModule && taggedModule[isCssEntry] === true;
            });

            if (hasOnlyCssModules) {
                this.cssEntries.add(entrypoint.name);
            }
        }
    }

    private alterCssChunks(assets: Assets, chunks: Chunk[]): void {
        for (let chunk of chunks) {
            if (!this.isCssChunk(chunk)) continue;

            this.alterCssChunk(assets, chunk);
        }
    }

    /**
     * Checks if the chunk is a CSS chunk.
     * @param chunk The chunk instance or chunk name.
     * @returns True if the chunk is a CSS chunk, or false otherwise.
     */
    private isCssChunk(chunk: string | Chunk): boolean {
        let chunkName = chunk instanceof Chunk
            ? chunk.name
            : chunk;

        return this.cssEntries.has(chunkName);
    }

    private alterCssChunk(assets: Assets, chunk: Chunk): void {
        let cssFiles: string[] = [];

        for (let file of chunk.files) {
            if (file.match(/\.js(\.map)?$/)) {
                // Remove JS file from assets and chunk
                delete assets[file];
                continue;
            }

            // Keep CSS file
            cssFiles.push(file);
        }

        chunk.files = cssFiles;
    }

    private reportBreakingChange(message: string): void {
        if (!this.breakingChangeErrorReported) {
            this.addWarning(message + " (possible breaking change in Webpack)");
            this.breakingChangeErrorReported = true;
        }
    }

    private addWarning(err: Error | string): Error {
        if (typeof err === "string") {
            err = new CssEntryPluginError(err);
        }

        this.compilation.warnings.push(err);
        return err;
    }
}
