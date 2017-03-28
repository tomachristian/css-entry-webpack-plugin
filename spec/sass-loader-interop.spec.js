describe("Running CssEntryPlugin and SassLoader for scss files", function () {
    beforeEach(function (done) {
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

    describe("configured with a shorthand single entry", function () {
        beforeEach(function () {
            this.webpack
                .config({
                    entry: fixtures.scss.style1.path
                });
        });

        describe("with loader default options", function () {
            beforeEach(function (done) { this.webpack.run(done); });

            it("generates a single css bundle with the compiled scss", function () {
                expect(this.webpack).toOutput({
                    fileCount: 1
                });

                expect(this.webpack).toOutput({
                    content: fixtures.scss.style1.content,
                    onlyOnce: false // TODO: check if this is correct
                });
            });
        });

        describe("with loader source maps", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        devtool: "source-map"
                    })
                    .run(done);
            });

            it("generates a single css bundle with the compiled scss and a single css map for the bundle", function () {
                expect(this.webpack).toOutput({
                    fileCount: 2
                });

                expect(this.webpack).toOutput({
                    content: fixtures.scss.style1.content,
                    onlyOnce: false
                });

                expect(this.webpack).toOutput({
                    file: "main.bundle.css.map",
                    withContent: [
                        "styles/style1.scss",
                        "@extend"
                    ],
                    onlyOnce: false
                });
            });
        });
    });
});
