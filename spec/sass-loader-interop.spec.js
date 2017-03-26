describe("Running CssEntryPlugin and SassLoader for scss files", () => {
    beforeEach(done => {
        this.webpack = webpackTestFixture(jasmine)
            .withCssEntryPlugin()
            .config({
                module: {
                    rules: [
                        {
                            test: /\.scss$/,
                            use: [
                                {
                                    loader: "css-loader",
                                    options: { sourceMap: true }
                                },
                                {
                                    loader: "sass-loader",
                                    options: { sourceMap: true }
                                }
                            ]
                        }
                    ]
                }
            })
            .cleanOutput(done);
    });

    describe("configured with a shorthand single entry", () => {
        beforeEach(() => {
            this.webpack
                .config({
                    entry: fixtures.scss.style1.path
                });
        });

        describe("with loader default options", () => {
            beforeEach(done => this.webpack.run(done));
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates a single css bundle with the compiled scss", () => {
                expect(this.webpack).toOutput({
                    content: fixtures.scss.style1.content
                });
            });

            it("generates the css bundle only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 1
                });
            });
        });

        describe("with loader source maps", () => {
            beforeEach(done => {
                this.webpack
                    .config({
                        devtool: "source-map"
                    })
                    .run(done);
            });
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates a single css bundle with the compiled scss", () => {
                expect(this.webpack).toOutput({
                    content: fixtures.scss.style1.content
                });
            });

            it("generates a single css map for the bundle", () => {
                expect(this.webpack).toOutput({
                    file: "main.bundle.css.map",
                    withContent: [
                        "styles/style1.scss",
                        "@extend"
                    ]
                });
            });

            it("generates the css bundle only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 2
                });
            });
        });
    });
});
