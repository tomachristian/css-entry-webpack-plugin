import { WithHtmlWebpackPlugin } from "html-webpack-plugin";
import { Compilation } from "../webpack";

export * from "html-webpack-plugin";

export function getHtmlWebpackPluginCompilation(compilation: Compilation): WithHtmlWebpackPlugin {
    return compilation as any;
}
