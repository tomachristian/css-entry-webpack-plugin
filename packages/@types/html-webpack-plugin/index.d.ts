import { AsyncWaterfallCallback } from "tapable";
import Compilation from "webpack/lib/Compilation";
import Chunk from "webpack/lib/Chunk";

export default class HtmlWebpackPlugin {
}

export interface WithHtmlWebpackPlugin {
    plugin(name: "html-webpack-plugin-alter-asset-tags",
           handler: (this: Compilation,
                     htmlData: HtmlData, callback: AlterAssetTagsCallback) => void): void;

    plugin(name: "html-webpack-plugin-alter-chunks",
           handler: (this: Compilation,
                     chunks: Chunk[], context: { plugin: HtmlWebpackPlugin }) => Chunk[]): void;
}

export type AlterAssetTagsCallback = AsyncWaterfallCallback<HtmlData>;

export interface HtmlData {
    head: HtmlAssetTag[];
    body: HtmlAssetTag[];
    plugin: HtmlWebpackPlugin;
    chunks: any[];
    outputName: string;
}

export interface HtmlAssetTag {
    tagName: string;
    closeTag?: boolean;
    selfClosingTag?: boolean;
    attributes: HtmlAssetTagAttributes;
}

export interface HtmlAssetTagAttributes {
    [attributeName: string]: string;
}
