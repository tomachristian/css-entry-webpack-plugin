describe("Running CssEntryPlugin and FileLoader", function () {
    beforeEach(function (done) {
        this.webpack = webpackTestFixture(jasmine)
            .withCssEntryPlugin()
            .config({
                module: {
                    rules: [
                        {
                            test: /\.png$/,
                            use: {
                                loader: "file-loader",
                                options: {
                                    name: "[name].[ext]"
                                }
                            }
                        }
                    ]
                }
            })
            .cleanOutput(done);
    });

    describe("configured with a shorthand single entry, that references a file", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: fixtures.style1WithImg1.path
                })
                .run(done);
        });

        it("generates a single css bundle with the referenced file path changed and the referenced file", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                content: [
                    ...fixtures.style1WithImg1.content,
                    `url(${fixtures.style1WithImg1.img1.file})`
                ]
            });

            expect(this.webpack).toOutput({
                file: fixtures.style1WithImg1.img1.file
            });
        });
    });

    describe("configured with a multi-main entry of two files, that both reference a file each", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: [
                        fixtures.style1WithImg1.path,
                        fixtures.style1WithImg2.path
                    ]
                })
                .run(done);
        });

        it("generates a single css bundle with the referenced file paths changed and the referenced files", function () {
            expect(this.webpack).toOutput({
                fileCount: 3
            });

            expect(this.webpack).toOutput({
                content: [
                    ...fixtures.style1WithImg1.content,
                    ...fixtures.style1WithImg2.content,
                    `url(${fixtures.style1WithImg1.img1.file})`,
                    `url(${fixtures.style1WithImg2.img2.file})`
                ]
            });

            expect(this.webpack).toOutput({
                file: fixtures.style1WithImg1.img1.file
            });

            expect(this.webpack).toOutput({
                file: fixtures.style1WithImg2.img2.file
            });
        });
    });

    describe("configured with two entries of one file each, that both reference a file each", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1WithImg1.path,
                        "test2": fixtures.style1WithImg2.path
                    }
                })
                .run(done);
        });

        it("generates two css bundles with the referenced file path changed and the referenced files", function () {
            expect(this.webpack).toOutput({
                fileCount: 4
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: [
                    ...fixtures.style1WithImg1.content,
                    `url(${fixtures.style1WithImg1.img1.file})`
                ]
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: [
                    ...fixtures.style1WithImg2.content,
                    `url(${fixtures.style1WithImg2.img2.file})`
                ]
            });

            expect(this.webpack).toOutput({
                file: fixtures.style1WithImg1.img1.file
            });

            expect(this.webpack).toOutput({
                file: fixtures.style1WithImg2.img2.file
            });
        });
    });

    describe("configured with two entries of one file each, that both reference the same file", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1WithImg1.path,
                        "test2": fixtures.style2WithImg1.path
                    }
                })
                .run(done);
        });

        it("generates two css bundles with the referenced file path changed", function () {
            expect(this.webpack).toOutput({
                fileCount: 3
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: [
                    ...fixtures.style1WithImg1.content,
                    `url(${fixtures.style1WithImg1.img1.file})`
                ]
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: [
                    ...fixtures.style2WithImg1.content,
                    `url(${fixtures.style2WithImg1.img1.file})`
                ]
            });

            expect(this.webpack).toOutput({
                file: fixtures.style1WithImg1.img1.file
            });
        });
    });
});
