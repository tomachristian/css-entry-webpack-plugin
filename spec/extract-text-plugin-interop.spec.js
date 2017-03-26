const ExtractTextPlugin = require("extract-text-webpack-plugin");

describe("Running CssEntryPlugin and ExtractTextPlugin", () => {
    beforeEach(done => {
        this.webpack = webpackTestFixture(jasmine)
            .cleanOutput(done);
    });

    describe("registered after CssEntryPlugin", () => {
        beforeEach(() => {
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

        describe("configured with a shorthand single entry, that references an extracted css", () => {
            beforeEach(done => {
                this.webpack
                    .config({
                        entry: fixtures.style1WithImport1.path
                    })
                    .run(done);
            });
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates a single css bundle", () => {
                expect(this.webpack).toOutput({
                    content: fixtures.style1WithImport1.content
                });
            });

            it("generates the css bundle only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 1
                });
            });
        });
    });

    describe("registered before CssEntryPlugin", () => {
        beforeEach(() => {
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

        describe("configured with a shorthand single entry, that references an extracted css", () => {
            beforeEach(done => {
                this.webpack
                    .config({
                        entry: fixtures.style1WithImport1.path
                    })
                    .run(done);
            });
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates a single css bundle", () => {
                expect(this.webpack).toOutput({
                    content: fixtures.style1WithImport1.content
                });
            });

            it("generates the css bundle only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 1
                });
            });
        });
    });

    describe("registered after and before CssEntryPlugin", () => {
        beforeEach(() => {
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

        describe("configured with a shorthand single entry, that references an extracted css", () => {
            beforeEach(done => {
                this.webpack
                    .config({
                        entry: fixtures.style1WithImport1.path
                    })
                    .run(done);
            });
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates a single css bundle", () => {
                expect(this.webpack).toOutput({
                    content: fixtures.style1WithImport1.content
                });
            });

            it("generates the css bundle only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 1
                });
            });
        });
    });
});
