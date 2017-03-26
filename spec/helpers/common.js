const path = require("path");
const fs = require("fs");

const rimraf = require("rimraf");

const CssEntryPlugin = require("../../lib");
const CssEntryPluginError = require("../../lib/CssEntryPluginError");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");

const FIXTURES_DIR = path.join(__dirname, "../fixtures");
const OUTPUT_DIR = path.join(__dirname, "../../tmp");

const fixtures = require(FIXTURES_DIR);

jasmine.getEnv().defaultTimeoutInterval = 30000;

class WebpackTestFixture {
    constructor(inputDir, outputDir) {
        this.cleanOutput = this.cleanOutput.bind(this);
        this.run = this.run.bind(this);

        this.inputDir = inputDir;
        this.outputDir = outputDir;

        this.webpackConfig = {
            context: this.inputDir,

            output: {
                path: this.outputDir,
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
                    }
                ]
            }
        };

        this.result = null;
    }

    cleanOutput(done) {
        rimraf(OUTPUT_DIR, done);
        return this;
    }

    withoutRules() {
        if (!this.webpackConfig.module) return this;

        this.webpackConfig.module.rules = [];
        return this;
    }

    withCssEntryPlugin(cssEntryPluginConfig, asIs) {
        if (asIs !== true) {
            const defaultCssEntryPluginConfig = {
                output: {
                    filename: "[name].bundle.css"   // TODO: Should be [name].css, like the default name
                }
            };

            cssEntryPluginConfig = webpackMerge(defaultCssEntryPluginConfig, cssEntryPluginConfig);
        }

        return this.config({
            plugins: [
                new CssEntryPlugin(cssEntryPluginConfig)
            ]
        });
    }

    config(additionalConfig) {
        this.webpackConfig = webpackMerge(this.webpackConfig, additionalConfig);
        return this;
    }

    run(done) {
        let run = new Promise((resolve, reject) => {
            try {
                webpack(this.webpackConfig, (err, stats) => {
                    this.result = {
                        err: err,
                        stats: stats
                    };
                    resolve(this);
                });
            }
            catch (err) {
                this.result = {
                    err: err,
                    stats: null
                };
                reject(err);
            }
        });

        if (!done) {
            return run;
        }

        run.then(done, done);
        return this;
    }
}

function webpackTestFixture(jasmine) {
    jasmine.addMatchers(customMatchers);

    return new WebpackTestFixture(FIXTURES_DIR, OUTPUT_DIR);
}

RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

const customMatchers = {
    toOutput() {
        return {
            compare(actual, expected) {
                if (expected.content && !expected.file) {
                    expected.file = "main.bundle.css";
                    expected.withContent = expected.content;
                }
                else if (expected.entry && !expected.file) {
                    expected.file = expected.entry + ".bundle.css";
                }

                if (expected.fileCount) {
                    let dir = fs.readdirSync(OUTPUT_DIR);

                    if (dir.length !== expected.fileCount) {
                        return {
                            pass: false,
                            message: `Expected webpack to output only ${expected.fileCount} files, ` +
                                     `but found ${dir.length} files.`
                        }
                    }
                }

                if (expected.file) {
                    let filePath = path.join(OUTPUT_DIR, expected.file);
                    let fileExists = fs.existsSync(filePath);

                    if (!fileExists) {
                        return {
                            pass: false,
                            message: `Expected webpack to output file '${expected.file}', ` +
                                     `but the output file was not found.` // TODO: List all the output files
                        }
                    }

                    let fileContent = (expected.withContent || expected.withoutContent)
                        ? fs.readFileSync(filePath)
                        : null;

                    if (expected.withContent) {
                        let expectedContent = expected.withContent;

                        for (let expectedPart of expectedContent) {
                            let occurences = (fileContent.toString()
                                .match(new RegExp(RegExp.escape(expectedPart), "g")) || [])
                                .length;

                            if ((expected.onlyOnce === true && occurences !== 1) ||
                                (expected.onlyOnce !== true && occurences === 0)) {
                                return {
                                    pass: false,
                                    message: `Expected output file '${expected.file}' ` +
                                             `to contain:\n` + expectedPart + ". But it contains:\n" + fileContent
                                }
                            }
                        }
                    }

                    if (expected.withoutContent) {
                        let unexpectedContent = expected.withoutContent;

                        for (let unexpectedPart of unexpectedContent) {
                            if (fileContent.indexOf(unexpectedPart) !== -1) {
                                return {
                                    pass: false,
                                    message: `Expected output file '${expected.file}' ` +
                                             `to not contain:\n` + unexpectedPart
                                }
                            }
                        }
                    }
                }

                return {
                    pass: true
                };
            }
        };
    },

    toSucceed() {
        return {
            compare(actual) {
                if (!actual || !actual.result) {
                    return {
                        pass: false,
                        message: "Expected webpack to succeed, but it did not return a result."
                    }
                }

                let { err, stats } = actual.result;

                if (err) {
                    return {
                        pass: false,
                        message: "Expected webpack to succeed, but it failed with:\n" +
                                  err.toString()
                    };
                }

                let compilationErrors = (stats.compilation.errors || []).join('\n');
                if (compilationErrors !== '') {
                    return {
                        pass: false,
                        message: "Expected webpack to succeed, but it failed with:\n" +
                                 compilationErrors
                    };
                }

                let compilationWarnings = (stats.compilation.warnings || []).join('\n');
                if (compilationErrors !== '') {
                    return {
                        pass: false,
                        message: "Expected webpack to succeed, but it returned some warnings:\n" +
                                 compilationErrors
                    };
                }

                return {
                    pass: true
                };
            }
        };
    }
};

//////////////////////////

function cleanOutput(done) {
    rimraf(OUTPUT_DIR, done);
}

function testWebpack(webpackConfig, cb) {
    const defaultWebpackConfig = {
        context: FIXTURES_DIR,

        output: {
            path: OUTPUT_DIR,
            filename: "[name].bundle.js"
        },

        resolve: {
            extensions: [".js", ".css", ".scss"]
        },

        module: {
            rules: [{
                test: /\.css$/,
                use: "css-loader"
            }]
        }
    };
    const config = webpackMerge(defaultWebpackConfig, webpackConfig);

    return webpack(config, cb);
}

function testWebpackWithCssEntryPlugin(webpackConfig, cssEntryPluginConfig, cb) {
    const defaultCssEntryPluginConfig = {
        output: {
            filename: "[name].bundle.css"
        }
    };

    if (!cb && typeof cssEntryPluginConfig === "function") {
        cb = cssEntryPluginConfig;
        cssEntryPluginConfig = defaultCssEntryPluginConfig;
    }

    const config = webpackMerge({
        plugins: [
            new CssEntryPlugin(cssEntryPluginConfig)
        ]
    }, webpackConfig);

    return testWebpack(config, cb);
}

function expectOutputFileExists(stats, outputFiles) {
    outputFiles = outputFiles || "main";

    if (!Array.isArray(outputFiles)) {
        outputFiles = [outputFiles];
    }

    for (let outputFile of outputFiles) {
        if (!outputFile.endsWith(".css")) {
            outputFile = outputFile + ".bundle.css";
        }

        let outputFileExists = fs.existsSync(path.join(OUTPUT_DIR, outputFile));
        expect(outputFileExists).toBe(true);
    }
}

function expectNoErrorsAndNoWarnings(err, stats) {
    expect(err).toBeFalsy();

    let compilationErrors = (stats.compilation.errors || []).join('\n');
    expect(compilationErrors).toBe('');

    let compilationWarnings = (stats.compilation.warnings || []).join('\n');
    expect(compilationWarnings).toBe('');
}

function expectOutputFileToContain(stats, outputFile, strings) {
    if (Array.isArray(outputFile)) {
        strings = outputFile;
        outputFile = "main";
    }

    if (!outputFile.endsWith(".css")) {
        outputFile = outputFile + ".bundle.css";
    }

    let content = fs.readFileSync(path.join(OUTPUT_DIR, outputFile));
    for (let str of strings) {
        expect(content).toContain(str);
    }
}

function expectHtmlOutputFileContent() {
    let htmlContent = fs.readFileSync(path.join(OUTPUT_DIR, "index.html"));
    return expect(htmlContent);
}

////

global.CssEntryPlugin = CssEntryPlugin;
global.CssEntryPluginError = CssEntryPluginError;

global.fixtures = fixtures;
global.webpackTestFixture = webpackTestFixture;

global.cleanOutput = cleanOutput;
global.testWebpack = testWebpack;
global.testWebpackWithCssEntryPlugin = testWebpackWithCssEntryPlugin;
global.expectOutputFileExists = expectOutputFileExists;
global.expectNoErrorsAndNoWarnings = expectNoErrorsAndNoWarnings;
global.expectOutputFileToContain = expectOutputFileToContain;
global.expectHtmlOutputFileContent = expectHtmlOutputFileContent;

/*module.exports = {
    FIXTURES_DIR,
    OUTPUT_DIR,

    WebpackTestFixture,
    webpackTestFixture,
    fixtures,

    cleanOutput,
    testWebpack,
    testWebpackWithCssEntryPlugin,
    expectOutputFileExists,
    expectNoErrorsAndNoWarnings,
    expectOutputFileToContain,

    expectHtmlOutputFileContent
};*/
