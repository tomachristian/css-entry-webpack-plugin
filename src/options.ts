import { EntryInfo } from "./models";
import CssEntryPluginError from "./CssEntryPluginError";

// Follow the standard https://webpack.js.org/configuration/output/#output-filename
const defaultOutputFilename = "[name].css",
      defaultExtensions = [".css", ".scss", ".less", ".styl"];

export function normalizeOptions(options?: Options): NormalizedOptions {
    // Sanitize
    if (!options) {
        options = {};
    }
    else if (typeof options === "string" ||
             typeof options === "function") {
        options = {
            output: {
                filename: options
            }
        };
    }

    if (typeof options !== "object") {
        throw new CssEntryPluginError("'options' should be of type string, function or object");
    }

    return {
        disable: !!options.disable,

        output: normalizeOutputOptions(options.output),

        includeCssEntry: makeIncludeCssEntry(options),
        isCssResource: makeIsCssResource(options)
    };
}

function normalizeOutputOptions(options?: OutputOptions): NormalizedOutputOptions {
    // Sanitize
    if (!options || !options.filename) {
        return {
            filename: defaultOutputFilename
        };
    }

    if (typeof options !== "object") {
        throw new CssEntryPluginError("'output' option should be of type object");
    }

    if (typeof options.filename !== "string" &&
        typeof options.filename !== "function") {
        throw new CssEntryPluginError(
            "'output.filename' option should be of type string or function");
    }

    return {
        filename: options.filename
    };
}

function makeIncludeCssEntry(options: OptionsObject): IncludeCssEntryFunction {
    if (options.entries && options.ignoreEntries) {
        throw new CssEntryPluginError("Both 'entries' and 'excludeEntries' specified");
    }

    if (options.entries) {
        return entryConditionToMatcher(options.entries);
    }

    if (options.ignoreEntries) {
        return entryConditionToMatcher(options.ignoreEntries, true);
    }

    return () => true;
}

function makeIsCssResource(options: OptionsObject): IsCssResourceFunction {
    if (!options.extensions && !options.test) {
        options.extensions = defaultExtensions;
    }

    if (options.extensions && options.test) {
        throw new CssEntryPluginError("Both 'extensions' and 'test' specified");
    }

    if (options.extensions) {
        if (!Array.isArray(options.extensions) &&
            typeof options.extensions !== "string") {
            throw new CssEntryPluginError(
                "Option 'extensions' should be an array of strings or a string");
        }

        let extensions = Array.isArray(options.extensions)
            ? [...options.extensions]
            : [options.extensions];

        return (resource: string, entry: any) => {
            for (let ext of extensions) {
                if (resource.endsWith(ext)) return true;
            }

            return false;
        };
    }

    if (options.test) {
        if (typeof options.test !== "function" &&
            !(options.test instanceof RegExp)) {
            throw new CssEntryPluginError(
                "Option 'test' should be a function or a regular expression");
        }

        if (options.test instanceof RegExp) {
            let regexp = options.test;
            options.test = (resource, entry) => regexp.test(resource);
        }

        return options.test;
    }

    return () => true;
}

function entryConditionToMatcher(
    condition: EntryCondition, negate: boolean = false): IncludeCssEntryFunction {
    let fn = (entry: EntryInfo) => true;

    if (typeof condition === "string") {
        fn = entry => entry.name === condition;
    }
    else if (Array.isArray(condition)) {
        fn = entry => condition.indexOf(entry.name) !== -1;
    }
    else if (condition instanceof RegExp) {
        fn = entry => condition.test(entry.name);
    }
    else if (typeof condition === "function") {
        fn = condition;
    }

    return negate
        ? _ => !fn(_)
        : fn;
}

export type EntryCondition = RegExp | string | string[] | ((entry: EntryInfo) => boolean);
export type EntryResourceCondition = RegExp | ((resource: string, entry: EntryInfo) => boolean);

export interface OptionsObject {
    disable?: boolean;

    /**
     * Output options.
     */
    output?: OutputOptions;

    /**
     * The condition for the entries to include.
     */
    entries?: EntryCondition;

    /**
     * The condition for the entries to ignore.
     */
    ignoreEntries?: EntryCondition;

    /**
     * Which file extensions will be valid in a css entry.
     */
    extensions?: string | string[];

    /**
     * A condition to match valid files for css entries.
     */
    test?: EntryResourceCondition;
}

export interface OutputOptions {
    /**
     * This option determines the name of each output bundle.
     * The bundle is written to the directory specified
     * by the output.path option (specified in the Webpack configuration).
     */
    filename?: FilenameOption;
}

export type FilenameTemplate = string;
export type GetPathFunction = (template: FilenameTemplate) => string;
export type FilenameDynamicOption = (getPath: GetPathFunction) => string;
export type FilenameOption = FilenameTemplate | FilenameDynamicOption;

export type Options = FilenameOption | OptionsObject;

export interface NormalizedOutputOptions {
    filename: FilenameOption;
}

export interface NormalizedOptions {
    disable: boolean;

    output: NormalizedOutputOptions;

    includeCssEntry: IncludeCssEntryFunction;
    isCssResource: IsCssResourceFunction;
}

export type IncludeCssEntryFunction = (entry: EntryInfo) => boolean;
export type IsCssResourceFunction = (resource: string, entry: EntryInfo) => boolean;
