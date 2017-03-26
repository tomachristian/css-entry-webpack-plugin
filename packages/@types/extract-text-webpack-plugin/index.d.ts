import { Loader } from "webpack";
import Compiler, { CompilerPlugin } from "webpack/lib/Compiler";

export default class ExtractTextPlugin implements CompilerPlugin {
    id: number;
    options: Options;

    /** Create a plugin instance defining the extraction target file(s) for the files loaded by `extract` */
    constructor(options: string | Options);

    /**
     * Creates an extracting loader from an existing loader.
     * Use the resulting loader in `module.rules`/`module.loaders`.
     */
    extract: (loader: Loader | Loader[] | ExtractOptions) => Loader[];

    apply(compiler: Compiler): void;
}

export interface Options {
    /** the filename of the result file. May contain `[name]`, `[id]` and `[contenthash]` */
    filename: string | ((getPath: ((template: string) => string)) => string);
    /** extract from all additional chunks too (by default it extracts only from the initial chunk(s)) */
    allChunks?: boolean;
    /** disables the plugin */
    disable?: boolean;
    /** Unique ident for this plugin instance. (For advanced usage only, by default automatically generated) */
    id?: string;
}

export interface ExtractOptions {
    /** the loader(s) that should be used for converting the resource to a css exporting module */
    use: Loader | Loader[];
    /** the loader(s) that should be used when the css is not extracted (i.e. in an additional chunk when `allChunks: false`) */
    fallback?: Loader | Loader[];
    /** override the `publicPath` setting for this loader */
    publicPath?: string;
}
