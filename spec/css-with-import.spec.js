describe("Running CssEntryPlugin for css files with imports", () => {
    beforeEach(done => {
        this.webpack = webpackTestFixture(jasmine)
            .withCssEntryPlugin()
            .cleanOutput(done);
    });

    describe("configured with a shorthand single entry", () => {
        beforeEach(done => {
            this.webpack
                .config({
                    entry: fixtures.style1WithImport1.path
                })
                .run(done);
        });
        beforeEach(() => expect(this.webpack).toSucceed());

        it("generates a single css bundle with the imported css", () => {
            expect(this.webpack).toOutput({
                content: [
                    ...fixtures.style1WithImport1.content,
                    ...fixtures.style1.content
                ]
            });
        });

        it("generates the css bundle only", () => {
            expect(this.webpack).toOutput({
                fileCount: 1
            });
        });
    });

    describe("configured with two entries, both with the same file", () => {
        beforeEach(done => {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1WithImport1.path,
                        "test2": fixtures.style1WithImport1.path
                    }
                })
                .run(done);
        });
        beforeEach(() => expect(this.webpack).toSucceed());

        it("generates two css bundles, both with the imported css", () => {
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

        it("generates two css bundles only", () => {
            expect(this.webpack).toOutput({
                fileCount: 2
            });
        });
    });

    describe("configured with two entries, both with the same file and one of them with the imported file in the entry", () => {
        beforeEach(done => {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1WithImport1.path,
                        "test2": [fixtures.style1WithImport1.path, fixtures.style1.path]
                    }
                })
                .run(done);
        });
        beforeEach(() => expect(this.webpack).toSucceed());

        it("generates two css bundles, both with the imported css", () => {
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

        it("does not add the content of the additional file twice", () => {
            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: [
                    ...fixtures.style1WithImport1.content,
                    ...fixtures.style1.content
                ],
                onlyOnce: true
            });
        });

        it("generates two css bundles only", () => {
            expect(this.webpack).toOutput({
                fileCount: 2
            });
        });
    });

    describe("configured with two entries, one with a file that has an import of the file in the other entry", () => {
        beforeEach(done => {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1WithImport1.path,
                        "test2": [fixtures.style1.path]
                    }
                })
                .run(done);
        });
        beforeEach(() => expect(this.webpack).toSucceed());

        it("generates two css bundles, both with the imported css", () => {
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

        it("generates two css bundles only", () => {
            expect(this.webpack).toOutput({
                fileCount: 2
            });
        });
    });
});
