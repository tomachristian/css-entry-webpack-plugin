import { toAsyncWaterfallHandler, toAsyncHandler } from "./interop/tapable";
import { CompilerPlugin, Compiler, AfterResolveData } from "./interop/webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import { Options, NormalizedOptions, normalizeOptions } from "./options";
import { getCssEntryPluginCompilation } from "./models";
import CssEntryPluginError from "./CssEntryPluginError";
import CssEntryCompilation from "./CssEntryCompilation";
import HtmlWebpackPluginCssEntryFix from "./HtmlWebpackPluginCssEntryFix";

export default class CssEntryPlugin implements CompilerPlugin {
    public readonly options: NormalizedOptions;

    /**
     * Creates a new instance of the CssEntryPlugin.
     * @param options The configuration options (required).
     */
    public constructor(options?: Options) {
        this.options = normalizeOptions(options);
    }

    /**
     * Called once by the compiler when installing the plugin.
     * @param compiler The compiler instance.
     */
    apply(compiler: Compiler): void {
        // We will use a single ExtractTextPlugin to extract the css entries
        let extractTextPlugin = new ExtractTextPlugin({
            disable: this.options.disable,
            filename: this.options.output.filename
        });

        compiler.apply(extractTextPlugin);

        // Using 'this-compilation' (do not hook into child compilations)
        compiler.plugin("this-compilation", (compilation, params) => {
            extractTextPlugin.options.disable = this.options.disable;
            if (this.options.disable === true) return;

            // Creating a CssEntryCompilation scoped to the new Compilation instance
            let cssEntryCompilation = new CssEntryCompilation(
                this.options, compiler, compilation, extractTextPlugin);

            getCssEntryPluginCompilation(compilation)
                .applyPlugins("css-entry-compilation", cssEntryCompilation);

            params.normalModuleFactory.plugin(
                "after-resolve", toAsyncWaterfallHandler<AfterResolveData>(data =>
                    cssEntryCompilation.onNormalModuleFactoryAfterResolve(data)));

            compilation.plugin(
                "after-seal", toAsyncHandler(() =>
                    cssEntryCompilation.onCompilationAfterSeal()));

            compilation.apply(new HtmlWebpackPluginCssEntryFix());
        });
    }

    /**
     * Enables the plugin.
     */
    enable(): void {
        this.options.disable = false;
    }

    /**
     * Disables the plugin.
     */
    disable(): void {
        this.options.disable = true;
    }
}
