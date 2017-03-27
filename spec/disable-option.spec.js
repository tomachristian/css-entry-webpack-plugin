describe("Running CssEntryPlugin disabled", function () {
    beforeEach(function (done) {
        this.webpack = webpackTestFixture(jasmine)
            .withCssEntryPlugin({
                disable: true
            })
            .cleanOutput(done);
    });

    describe("configured with a shorthand single entry (.css)", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: fixtures.style1.path
                })
                .run(done);
        });

        it("generates a single js bundle", function () {
            expect(this.webpack).toOutput({
                fileCount: 1,
                file: "main.bundle.js",
                withContent: fixtures.style1.content
            });
        });
    });

    describe("configured with a shorthand single entry (.js)", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: fixtures.script1.path
                })
                .run(done);
        });

        it("generates a single js bundle", function () {
            expect(this.webpack).toOutput({
                fileCount: 1,
                file: "main.bundle.js",
                withContent: fixtures.script1.content
            });
        });
    });

    describe("configured with multi entry (1: .js, 2: .css)", function () {
        beforeEach(function (done) {
            this.webpack
                .config({
                    entry: {
                        "style": fixtures.style1.path,
                        "script": fixtures.script1.path
                    }
                })
                .run(done);
        });

        it("generates two js bundles", function () {
            expect(this.webpack).toOutput({
                fileCount: 2
            });

            expect(this.webpack).toOutput({
                file: "style.bundle.js",
                withContent: fixtures.style1.content
            });

            expect(this.webpack).toOutput({
                file: "script.bundle.js",
                withContent: fixtures.script1.content
            });
        });
    });
});
