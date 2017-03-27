describe("Running CssEntryPlugin for css files with imports", function () {
    beforeEach(function (done) {
        this.webpack = webpackTestFixture(jasmine)
            .withCssEntryPlugin()
            .cleanOutput(done);
    });

    describe("configured with a shorthand single entry", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: fixtures.style1WithImport1.path
                })
                .run(done);
        });

        it("generates a single css bundle with the imported css", function () {
            expect(this.webpack).toOutput({
                fileCount: 1,
                content: [
                    ...fixtures.style1WithImport1.content,
                    ...fixtures.style1.content
                ]
            });
        });
    });

    describe("configured with two entries, both with the same file", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1WithImport1.path,
                        "test2": fixtures.style1WithImport1.path
                    }
                })
                .run(done);
        });

        it("generates two css bundles, both with the imported css", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: [
                    ...fixtures.style1WithImport1.content,
                    ...fixtures.style1.content
                ]
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: [
                    ...fixtures.style1WithImport1.content,
                    ...fixtures.style1.content
                ]
            });
        });
    });

    describe("configured with two entries, both with the same file and one of them with the imported file in the entry", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1WithImport1.path,
                        "test2": [fixtures.style1WithImport1.path, fixtures.style1.path]
                    }
                })
                .run(done);
        });

        it("generates two css bundles, both with the imported css and does not add the content of the additional file twice", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: [
                    ...fixtures.style1WithImport1.content,
                    ...fixtures.style1.content
                ]
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: [
                    ...fixtures.style1WithImport1.content,
                    ...fixtures.style1.content
                ],
                onlyOnce: true
            });
        });
    });

    describe("configured with two entries, one with a file that has an import of the file in the other entry", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1WithImport1.path,
                        "test2": [fixtures.style1.path]
                    }
                })
                .run(done);
        });

        it("generates two css bundles, both with the imported css", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: [
                    ...fixtures.style1WithImport1.content,
                    ...fixtures.style1.content
                ]
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: fixtures.style1.content
            });
        });
    });
});
