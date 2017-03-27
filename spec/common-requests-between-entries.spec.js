describe("Running CssEntryPlugin for entries with common requests", function () {
    beforeEach(function (done) {
        this.webpack = webpackTestFixture(jasmine)
            .withCssEntryPlugin()
            .cleanOutput(done);
    });

    describe("configured with two single entries, both with the same file", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1.path,
                        "test2": fixtures.style1.path
                    }
                })
                .run(done);
        });

        it("generates two css bundles, both with the same css", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: fixtures.style1.content,
                onlyOnce: true
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: fixtures.style1.content,
                onlyOnce: true
            });
        });
    });

    describe("configured with one single entry and a multi entry, both with the same file only", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1.path,
                        "test2": [fixtures.style1.path]
                    }
                })
                .run(done);
        });

        it("generates two css bundles, both with the same css", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: fixtures.style1.content,
                onlyOnce: true
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: fixtures.style1.content,
                onlyOnce: true
            });
        });
    });

    describe("configured with two multi entries, both with the same file only", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": [fixtures.style1.path],
                        "test2": [fixtures.style1.path]
                    }
                })
                .run(done);
        });

        it("generates two css bundles, both with the same css", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: fixtures.style1.content,
                onlyOnce: true
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: fixtures.style1.content,
                onlyOnce: true
            });
        });
    });

    describe("configured with two multi entries, both with the same two files only", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": [fixtures.style1.path, fixtures.style2.path],
                        "test2": [fixtures.style1.path, fixtures.style2.path]
                    }
                })
                .run(done);
        });

        it("generates two css bundles, both with the same css", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: [
                    ...fixtures.style1.content,
                    ...fixtures.style2.content
                ],
                onlyOnce: true
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: [
                    ...fixtures.style1.content,
                    ...fixtures.style2.content
                ],
                onlyOnce: true
            });
        });
    });

    describe("configured with one single entry and a multi entry with the same file and an extra non-css file", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": fixtures.style1.path,
                        "test2": [fixtures.style1.path, fixtures.script1.path]
                    }
                })
                .run(done);
        });

        it("generates one css bundle and one js bundle, both with the same css", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: fixtures.style1.content,
                onlyOnce: true
            });

            expect(this.webpack).toOutput({
                file: "test2.bundle.js",
                withContent: [
                    ...fixtures.script1.content,
                    ...fixtures.style1.content
                ],
                onlyOnce: true
            });
        });
    });

    describe("configured with two multi entries with the same file and one with an extra non-css file", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "test1": [fixtures.style1.path],
                        "test2": [fixtures.style1.path, fixtures.script1.path]
                    }
                })
                .run(done);
        });

        it("generates one css bundle and one js bundle, both with the same css", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                entry: "test1",
                withContent: fixtures.style1.content,
                onlyOnce: true
            });

            expect(this.webpack).toOutput({
                file: "test2.bundle.js",
                withContent: [
                    ...fixtures.script1.content,
                    ...fixtures.style1.content
                ],
                onlyOnce: true
            });
        });
    });
});
