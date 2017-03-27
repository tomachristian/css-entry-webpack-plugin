const HtmlWebpackPlugin = require("html-webpack-plugin");

describe("Running CssEntryPlugin and HtmlWebpackPlugin", function () {
    beforeEach(function (done) {
        this.webpack = webpackTestFixture(jasmine)
            .withCssEntryPlugin()
            .cleanOutput(done);
    });

    describe("with default options", function () {
        beforeEach(function () {
            this.webpack
                .config({
                    plugins: [
                        new HtmlWebpackPlugin()
                    ]
                });
        });

        describe("configured with a shorthand single entry", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        entry: fixtures.style1.path
                    })
                    .run(done);
            });

            it("generates a single css bundle and a single html file with the link for the css bundle", function () {
                expect(this.webpack).toOutput({
                    fileCount: 2
                });

                expect(this.webpack).toOutput({
                    content: fixtures.style1.content
                });

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
        });

        describe("configured with two entries, both with one file each", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        entry: {
                            "test1": fixtures.style1.path,
                            "test2": fixtures.style2.path
                        }
                    })
                    .run(done);
            });

            it("generates two css bundles and a single html file with the links for the css bundles", function () {
                expect(this.webpack).toOutput({
                    fileCount: 3
                });

                expect(this.webpack).toOutput({
                    entry: "test1",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    entry: "test2",
                    withContent: fixtures.style2.content
                });

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
        });

        describe("with separate css and js entry points", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        entry: {
                            "test1": fixtures.style1.path,
                            "test2": fixtures.script1.path
                        }
                    })
                    .run(done);
            });

            it("generates one css bundle, one js bundle and a single html file with the link for the css bundle and the script for the js bundle", function () {
                expect(this.webpack).toOutput({
                    fileCount: 3
                });

                expect(this.webpack).toOutput({
                    entry: "test1",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    file: "test2.bundle.js",
                    withContent: fixtures.script1.content
                });

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
        });
    });

    describe("with explicit chunks excluded", function () {
        beforeEach(function () {
            this.webpack
                .config({
                    plugins: [
                        new HtmlWebpackPlugin({
                            excludeChunks: ["test1"]
                        })
                    ]
                });
        });

        describe("configured with a single entry", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        entry: {
                            "test1": fixtures.style1.path
                        }
                    })
                    .run(done);
            });

            it("generates a single css bundle and a single html file without the link for the css bundle", function () {
                expect(this.webpack).toOutput({
                    fileCount: 2
                });

                expect(this.webpack).toOutput({
                    entry: "test1",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    file: "index.html",
                    withoutContent: [
                        `<script`,
                        `<link`
                    ]
                });
            });
        });

        describe("configured with two entries and one is excluded", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        entry: {
                            "test1": fixtures.style1.path,
                            "test2": fixtures.style2.path
                        }
                    })
                    .run(done);
            });

            it("generates two css bundles and a single html file without the link for the excluded css bundle", function () {
                expect(this.webpack).toOutput({
                    fileCount: 3
                });

                expect(this.webpack).toOutput({
                    entry: "test1",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    entry: "test2",
                    withContent: fixtures.style2.content
                });

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
        });

        describe("with separate css and js entry points", function () {
            describe("with css excluded", function () {
                beforeEach(function (done) {
                    this.webpack
                        .config({
                            entry: {
                                "test1": fixtures.style1.path,
                                "test2": fixtures.script1.path
                            }
                        })
                        .run(done);
                });

                it("generates one css bundle, one js bundle and a single html file with only the script for the js bundle", function () {
                    expect(this.webpack).toOutput({
                        fileCount: 3
                    });

                    expect(this.webpack).toOutput({
                        entry: "test1",
                        withContent: fixtures.style1.content
                    });

                    expect(this.webpack).toOutput({
                        file: "test2.bundle.js",
                        withContent: fixtures.script1.content
                    });

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
            });

            describe("with js excluded", function () {
                beforeEach(function (done) {
                    this.webpack
                        .config({
                            entry: {
                                "test1": fixtures.script1.path,
                                "test2": fixtures.style1.path
                            }
                        })
                        .run(done);
                });

                it("generates one css bundle, one js bundle and a single html file with only the link for the css bundle", function () {
                    expect(this.webpack).toOutput({
                        fileCount: 3
                    });

                    expect(this.webpack).toOutput({
                        entry: "test2",
                        withContent: fixtures.style1.content
                    });

                    expect(this.webpack).toOutput({
                        file: "test1.bundle.js",
                        withContent: fixtures.script1.content
                    });

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
            });
        });
    });

    describe("with explicit chunks included", function () {
        beforeEach(function () {
            this.webpack
                .config({
                    plugins: [
                        new HtmlWebpackPlugin({
                            chunks: ["test1"]
                        })
                    ]
                });
        });

        describe("configured with two entries and one is included", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        entry: {
                            "test1": fixtures.style1.path,
                            "test2": fixtures.style2.path
                        }
                    })
                    .run(done);
            });

            it("generates two css bundles and a single html file only with the link for the included css bundle", function () {
                expect(this.webpack).toOutput({
                    fileCount: 3
                });

                expect(this.webpack).toOutput({
                    entry: "test1",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    entry: "test2",
                    withContent: fixtures.style2.content
                });

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
        });
    });
});
