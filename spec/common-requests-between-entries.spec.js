describe("Running CssEntryPlugin for entries with common requests", function () {
    beforeEach(function (done) {
        this.webpack = webpackTestFixture(jasmine)
            .withCssEntryPlugin()
            .cleanOutput(done);
    });

    describe("configured with two single entries (1: 1.css, 2: 1.css)", function () {
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
                withContent: fixtures.style1.content
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: fixtures.style1.content
            });
        });
    });

    describe("configured with a single entry and a multi entry " +
             "(1: 1.css, 2: [1.css])", function () {
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
                withContent: fixtures.style1.content
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: fixtures.style1.content
            });
        });
    });

    describe("configured with two multi entries (1: [1.css], 2: [1.css])", function () {
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
                withContent: fixtures.style1.content
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: fixtures.style1.content
            });
        });
    });

    describe("configured with two multi entries " +
             "(1: [1.css, 2.css], 2: [1.css, 2.css])", function () {
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
                ]
            });

            expect(this.webpack).toOutput({
                entry: "test2",
                withContent: [
                    ...fixtures.style1.content,
                    ...fixtures.style2.content
                ]
            });
        });
    });

    describe("configured with one single entry and a multi entry " +
             "with an extra non-css file (1: 1.css, 2: [1.css, *.js])", function () {
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
                withContent: fixtures.style1.content
            });

            expect(this.webpack).toOutput({
                file: "test2.bundle.js",
                withContent: [
                    ...fixtures.script1.content,
                    ...fixtures.style1.content
                ]
            });
        });
    });

    describe("configured with two multi entries with the same file " +
             "with an extra non-css file (1: [1.css], 2: [1.css, *.js])", function () {
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
                withContent: fixtures.style1.content
            });

            expect(this.webpack).toOutput({
                file: "test2.bundle.js",
                withContent: [
                    ...fixtures.script1.content,
                    ...fixtures.style1.content
                ]
            });
        });
    });
});
