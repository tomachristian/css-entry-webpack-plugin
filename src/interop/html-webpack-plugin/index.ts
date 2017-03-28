import { WithHtmlWebpackPlugin, HtmlData, HtmlAssetTag } from "html-webpack-plugin";
import { Compilation } from "../webpack";

export { HtmlData, HtmlAssetTag };

export function getHtmlWebpackPluginCompilation(compilation: Compilation): WithHtmlWebpackPlugin {
    return compilation as any;
}
