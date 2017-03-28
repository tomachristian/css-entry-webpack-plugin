import webpack from "./lib/webpack";

export * from "./lib/webpack";
export default webpack;

// Forward webpack-sources
import Source from "webpack-sources/lib/Source";

export { Source };

// Forward enhanced-resolve
import Resolver from "enhanced-resolve/lib/Resolver";

export { Resolver };
