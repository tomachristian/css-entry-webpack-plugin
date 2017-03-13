import { toAsyncWaterfallHandler } from "./interop/tapable";
import { CompilationPlugin, Compilation } from "./interop/webpack";
import { HtmlData, HtmlAssetTag,
         getHtmlWebpackPluginCompilation } from "./interop/html-webpack-plugin";

export default class HtmlWebpackPluginCssEntryFix implements CompilationPlugin {
    apply(compilation: Compilation): void {
        // Support for HtmlWebpackPlugin interop
        getHtmlWebpackPluginCompilation(compilation).plugin(
            "html-webpack-plugin-alter-asset-tags",
            toAsyncWaterfallHandler<HtmlData>(htmlData =>
                this.onHtmlWebpackPluginAlterAssetTags(htmlData)));
    }

    /**
     * Called by the HtmlWebpackPlugin for other plugins to change the assetTag definitions.
     * @param htmlPluginData The html plugin data that contains the asset tags.
     * @param callback The callback to call when ready.
     * @see https://github.com/jantimon/html-webpack-plugin/blob/master/index.js
     * @see https://github.com/jantimon/html-webpack-plugin#events
     */
    // TODO: Create fix PR to https://github.com/jantimon/html-webpack-plugin/blob/master/index.js
    public async onHtmlWebpackPluginAlterAssetTags(htmlData: HtmlData): Promise<HtmlData> {
        const filterFn = (tag: HtmlAssetTag) =>
            !(tag.tagName === "script" && tag.attributes.src.match(/\.css$/));

        htmlData.head = htmlData.head.filter(filterFn);
        htmlData.body = htmlData.body.filter(filterFn);

        return htmlData;
    }
}
