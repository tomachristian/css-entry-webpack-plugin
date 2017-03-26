const HtmlWebpackPlugin = require("html-webpack-plugin");

describe("Running CssEntryPlugin and HtmlWebpackPlugin", () => {
    beforeEach(done => {
        this.webpack = webpackTestFixture(jasmine)
            .withCssEntryPlugin()
            .cleanOutput(done);
    });

    describe("with default options", () => {
        beforeEach(() => {
            this.webpack
                .config({
                    plugins: [
                        new HtmlWebpackPlugin()
                    ]
                });
        });

        describe("configured with a shorthand single entry", () => {
            beforeEach(done => {
                this.webpack
                    .config({
                        entry: fixtures.style1.path
                    })
                    .run(done);
            });
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates a single css bundle", () => {
                expect(this.webpack).toOutput({
                    content: fixtures.style1.content
                });
            });

            it("generates a single html file with the link for the css bundle", () => {
                expect(this.webpack).toOutput({
                    file: "index.html",
                    withContent: [
                        `<link href="main.bundle.css" rel="stylesheet">`
                    ],
                    onlyOnce: true,

                    withoutContent: [
                        `src="main.bundle.js"`,
                        `<script`
                    ]
                });
            });

            it("generates the css bundle and html only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 2
                });
            });
        });

        describe("configured with two entries, both with one file each", () => {
            beforeEach(done => {
                this.webpack
                    .config({
                        entry: {
                            "test1": fixtures.style1.path,
                            "test2": fixtures.style2.path
                        }
                    })
                    .run(done);
            });
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates two css bundles", () => {
                expect(this.webpack).toOutput({
                    entry: "test1",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    entry: "test2",
                    withContent: fixtures.style2.content
                });
            });

            it("generates a single html file with the links for the css bundles", () => {
                expect(this.webpack).toOutput({
                    file: "index.html",
                    withContent: [
                        `<link href="test1.bundle.css" rel="stylesheet">`,
                        `<link href="test2.bundle.css" rel="stylesheet">`
                    ],
                    onlyOnce: true,

                    withoutContent: [
                        `<script`
                    ]
                });
            });

            it("generates the two css bundles and html only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 3
                });
            });
        });

        describe("with separate css and js entry points", () => {
            beforeEach(done => {
                this.webpack
                    .config({
                        entry: {
                            "test1": fixtures.style1.path,
                            "test2": fixtures.script1.path
                        }
                    })
                    .run(done);
            });
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates one css bundle", () => {
                expect(this.webpack).toOutput({
                    entry: "test1",
                    withContent: fixtures.style1.content
                });
            });

            it("generates one js bundle", () => {
                expect(this.webpack).toOutput({
                    file: "test2.bundle.js",
                    withContent: fixtures.script1.content
                });
            });

            it("generates a single html file with the link for the css bundle and the script for the js bundle", () => {
                expect(this.webpack).toOutput({
                    file: "index.html",
                    withContent: [
                        `<link href="test1.bundle.css" rel="stylesheet">`,
                        `src="test2.bundle.js"></script>`
                    ],
                    onlyOnce: true,

                    withoutContent: [
                        `href="test2.bundle.js"`,
                        `src="test1.bundle.css"`
                    ]
                });
            });

            it("generates one css bundle, a js bundle and html only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 3
                });
            });
        });
    });

    describe("with explicit chunks excluded", () => {
        beforeEach(() => {
            this.webpack
                .config({
                    plugins: [
                        new HtmlWebpackPlugin({
                            excludeChunks: ["test1"]
                        })
                    ]
                });
        });

        describe("configured with a single entry", () => {
            beforeEach(done => {
                this.webpack
                    .config({
                        entry: {
                            "test1": fixtures.style1.path
                        }
                    })
                    .run(done);
            });
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates a single css bundle", () => {
                expect(this.webpack).toOutput({
                    entry: "test1",
                    withContent: fixtures.style1.content
                });
            });

            it("generates a single html file without the link for the css bundle", () => {
                expect(this.webpack).toOutput({
                    file: "index.html",
                    withoutContent: [
                        `<script`,
                        `<link`
                    ]
                });
            });

            it("generates the css bundle and html only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 2
                });
            });
        });

        describe("configured with two entries and one is excluded", () => {
            beforeEach(done => {
                this.webpack
                    .config({
                        entry: {
                            "test1": fixtures.style1.path,
                            "test2": fixtures.style2.path
                        }
                    })
                    .run(done);
            });
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates two css bundles", () => {
                expect(this.webpack).toOutput({
                    entry: "test1",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    entry: "test2",
                    withContent: fixtures.style2.content
                });
            });

            it("generates a single html file without the link for the excluded css bundle", () => {
                expect(this.webpack).toOutput({
                    file: "index.html",
                    withContent: [
                        `<link href="test2.bundle.css" rel="stylesheet">`
                    ],
                    onlyOnce: true,

                    withoutContent: [
                        `<script`,
                        `<link href="test1.bundle.css" rel="stylesheet">`
                    ]
                });
            });

            it("generates the two css bundles and html only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 3
                });
            });
        });

        describe("with separate css and js entry points", () => {
            describe("with css excluded", () => {
                beforeEach(done => {
                    this.webpack
                        .config({
                            entry: {
                                "test1": fixtures.style1.path,
                                "test2": fixtures.script1.path
                            }
                        })
                        .run(done);
                });
                beforeEach(() => expect(this.webpack).toSucceed());

                it("generates one css bundle", () => {
                    expect(this.webpack).toOutput({
                        entry: "test1",
                        withContent: fixtures.style1.content
                    });
                });

                it("generates one js bundle", () => {
                    expect(this.webpack).toOutput({
                        file: "test2.bundle.js",
                        withContent: fixtures.script1.content
                    });
                });

                it("generates a single html file with only the script for the js bundle", () => {
                    expect(this.webpack).toOutput({
                        file: "index.html",
                        withContent: [
                            `src="test2.bundle.js"></script>`
                        ],
                        onlyOnce: true,

                        withoutContent: [
                            `<link`,
                            `href="test2.bundle.js"`,
                            `src="test1.bundle.css"`
                        ]
                    });
                });

                it("generates one css bundle, a js bundle and html only", () => {
                    expect(this.webpack).toOutput({
                        fileCount: 3
                    });
                });
            });

            describe("with js excluded", () => {
                beforeEach(done => {
                    this.webpack
                        .config({
                            entry: {
                                "test1": fixtures.script1.path,
                                "test2": fixtures.style1.path
                            }
                        })
                        .run(done);
                });
                beforeEach(() => expect(this.webpack).toSucceed());

                it("generates one css bundle", () => {
                    expect(this.webpack).toOutput({
                        entry: "test2",
                        withContent: fixtures.style1.content
                    });
                });

                it("generates one js bundle", () => {
                    expect(this.webpack).toOutput({
                        file: "test1.bundle.js",
                        withContent: fixtures.script1.content
                    });
                });

                it("generates a single html file with only the link for the css bundle", () => {
                    expect(this.webpack).toOutput({
                        file: "index.html",
                        withContent: [
                            `<link href="test2.bundle.css" rel="stylesheet">`
                        ],
                        onlyOnce: true,

                        withoutContent: [
                            `href="test1.bundle.js"`,
                            `<script`
                        ]
                    });
                });

                it("generates one css bundle, a js bundle and html only", () => {
                    expect(this.webpack).toOutput({
                        fileCount: 3
                    });
                });
            });
        });
    });

    describe("with explicit chunks included", () => {
        beforeEach(() => {
            this.webpack
                .config({
                    plugins: [
                        new HtmlWebpackPlugin({
                            chunks: ["test1"]
                        })
                    ]
                });
        });

        describe("configured with two entries and one is included", () => {
            beforeEach(done => {
                this.webpack
                    .config({
                        entry: {
                            "test1": fixtures.style1.path,
                            "test2": fixtures.style2.path
                        }
                    })
                    .run(done);
            });
            beforeEach(() => expect(this.webpack).toSucceed());

            it("generates two css bundles", () => {
                expect(this.webpack).toOutput({
                    entry: "test1",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    entry: "test2",
                    withContent: fixtures.style2.content
                });
            });

            it("generates a single html file only with the link for the included css bundle", () => {
                expect(this.webpack).toOutput({
                    file: "index.html",
                    withContent: [
                        `<link href="test1.bundle.css" rel="stylesheet">`
                    ],
                    onlyOnce: true,

                    withoutContent: [
                        `<script`,
                        `<link href="test2.bundle.css" rel="stylesheet">`
                    ]
                });
            });

            it("generates the two css bundles and html only", () => {
                expect(this.webpack).toOutput({
                    fileCount: 3
                });
            });
        });
    });
});
