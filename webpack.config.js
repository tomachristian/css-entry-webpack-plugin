const path = require("path");

const webpack = require("webpack");

const CssEntryPlugin = require("./lib");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let extractTextPlugin1 = new ExtractTextPlugin({
    filename: "[name].bundle.css"/*,
    allChunks: true*/
});

let i=0;

let config ={
    context: path.join(__dirname, "spec/fixtures"),
    entry: {
        "test0": "./styles/style1.css",
        "test1": ["./styles/style4.css"],
        "test2": ["./styles/style4.css"]

        /*"test1": "./styles/style4.css",
        "test2": ["./styles/style4.css", "./script2.js"]*/

        /*"test0": "./script1-with-require1.js",
        "test1": ["./styles/style1.css", "./styles/style1-with-import1.css"],
        "test2": ["./styles/style1-with-import1.css"],
        "test4": "./script1.js",
        "test3": "./styles/style4.css",
        "test5": ["./styles/style4.css", "./script2.js"],*/
    },

    /*entry: function () {
        console.log("call entry");
        i++;
        if (i==1) {
            return {
                "test0": "./script1-with-require1.js",
                "test1": ["./styles/style1.css", "./styles/style1-with-import1.css"],
                "test2": ["./styles/style1-with-import1.css"],
                "test4": "./script1.js",
                "test3": "./styles/style2.css",
                "test5": ["./styles/style4.css", "./script2.js"],
            };
        }
        else if (i==2) {
            return {
                "test7": "./script1-with-require1.js"
            };
        }
        else if (i==3) {
            return {
                "test8": "./styles/style4.css"
            };
        }
        else if (i==4) {
            return {
                "test9": "./styles/style2.css"
            };
        }
        else {
            return {
                "test0": "./script1-with-require1.js",
                "test1": ["./styles/style1.css", "./styles/style1-with-import1.css"],
                "test2": ["./styles/style1-with-import1.css"],
                "test4": "./script1.js",
                "test3": "./styles/style2.css",
                "test5": ["./styles/style4.css", "./script2.js"],
            };
        }
    },*/

    devtool: "source-map",

    output: {
        path: path.join(__dirname, "tmp"),
        filename: "[name].bundle.js"
    },

    resolve: {
        extensions: [".js", ".css", ".scss"]
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: "css-loader"
            }/*,
            {
                test: /\.css$/,
                use: extractTextPlugin1.extract({
                    use: "css-loader"
                })
            }*/
        ]
    },

    plugins: [
        //extractTextPlugin1,
        new CssEntryPlugin({
            output: {
                filename: "[name].bundle.css"
            }
        }),
        /*(function () {
            class TestPlugin {
                apply(compiler) {
                    compiler.plugin("this-compilation", function (comp) {
                        comp.plugin("build-module", function(module) {
                            //console.log("test", chunks.map(x => x.name));
                            let a=comp;
                            let m;

                            if (m = comp.entries.find(m => m.debugId === module.debugId)) {
                                console.log("entry module");
                            }

                            console.log(">> ", module.constructor.name);
                            if (module.constructor.name == "MultiModule") {
                                console.log(">> ", module.name);
                            }
                            else {
                                console.log(">> ", module.request);
                            }
                        });
                        comp.plugin("optimize-extracted-chunks", function (ec) {
                            //console.log(ec);
                        });
                    });

                    compiler.plugin("normal-module-factory", normalModuleFactory => {
                        normalModuleFactory.plugin("after-resolve", (data, cb) => {
                            console.log("-- ", data.dependencies[0] ? data.dependencies[0].loc : "?");
                            cb(null, data);
                        });
                    });
                }
            }

            return new TestPlugin()
        })()*/
    ]
};

if (process.env.RUN_WEBPACK == "true") {
    webpack(config, function (err, stats) {
        if (!err) return;
        console.log(err);
    });
}
else {
    module.exports=config;
}
