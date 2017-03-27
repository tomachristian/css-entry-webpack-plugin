const ExtractTextPlugin = require("extract-text-webpack-plugin");

describe("Running CssEntryPlugin and ExtractTextPlugin", function () {
    beforeEach(function (done) {
        this.webpack = webpackTestFixture(jasmine)
            .cleanOutput(done);
    });

    describe("registered after CssEntryPlugin", function () {
        beforeEach(function () {
            this.webpack
                .withCssEntryPlugin()
                .config({
                    module: {
                        rules: [
                            {
                                test: /\.css$/,
                                issuer: /import\d\.css$/,
                                use: ExtractTextPlugin.extract({
                                    use: "css-loader"
                                })
                            }
                        ]
                    },

                    plugins: [
                        new ExtractTextPlugin("other-styles.css")
                    ]
                });
        });

        describe("configured with a shorthand single entry, that references an extracted css", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        entry: fixtures.style1WithImport1.path
                    })
                    .run(done);
            });

            it("generates a single css bundle", function () {
                expect(this.webpack).toOutput({
                    fileCount: 1,
                    content: fixtures.style1WithImport1.content
                });
            });
        });
    });

    describe("registered before CssEntryPlugin", function () {
        beforeEach(function () {
            this.webpack
                .config({
                    module: {
                        rules: [
                            {
                                test: /\.css$/,
                                issuer: /import\d\.css$/,
                                use: ExtractTextPlugin.extract({
                                    use: "css-loader"
                                })
                            }
                        ]
                    },

                    plugins: [
                        new ExtractTextPlugin("other-styles.css")
                    ]
                })
                .withCssEntryPlugin();
        });

        describe("configured with a shorthand single entry, that references an extracted css", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        entry: fixtures.style1WithImport1.path
                    })
                    .run(done);
            });

            it("generates a single css bundle", function () {
                expect(this.webpack).toOutput({
                    fileCount: 1,
                    content: fixtures.style1WithImport1.content
                });
            });
        });
    });

    describe("registered after and before CssEntryPlugin", function () {
        beforeEach(function () {
            let extractTextPlugin1 = new ExtractTextPlugin("other-styles1.css");

            this.webpack
                .config({
                    plugins: [
                        extractTextPlugin1
                    ]
                })
                .withCssEntryPlugin()
                .config({
                    module: {
                        rules: [
                            {
                                test: /\.css$/,
                                issuer: /import\d\.css$/,
                                use: ExtractTextPlugin.extract({
                                    use: "css-loader"
                                })
                            }
                        ]
                    },

                    plugins: [
                        new ExtractTextPlugin("other-styles.css")
                    ]
                });
        });

        describe("configured with a shorthand single entry, that references an extracted css", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        entry: fixtures.style1WithImport1.path
                    })
                    .run(done);
            });

            it("generates a single css bundle", function () {
                expect(this.webpack).toOutput({
                    fileCount: 1,
                    content: fixtures.style1WithImport1.content
                });
            });
        });
    });
});
