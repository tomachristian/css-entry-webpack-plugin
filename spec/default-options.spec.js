describe("Running CssEntryPlugin", function () {
    beforeEach(function (done) {
        this.webpack = webpackTestFixture(jasmine)
            .cleanOutput(done);
    });

    describe("without options", function () {
        beforeEach(function () {
            this.webpack
                .withCssEntryPlugin(null, true);
        });

        describe("configured with a shorthand single entry (.css)", function () {
            beforeEach(function (done) {
                this.webpack
                    .config({
                        entry: fixtures.style1.path
                    })
                    .run(done);
            });

            it("generates a single css bundle with the default filename", function () {
                expect(this.webpack).toOutput({
                    fileCount: 1,
                    file: "main.css",
                    withContent: fixtures.style1.content
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

            it("generates one js bundle and one css bundle with the default filename", function () {
                expect(this.webpack).toOutput({
                    fileCount: 2
                });

                expect(this.webpack).toOutput({
                    file: "style.css",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    file: "script.bundle.js",
                    withContent: fixtures.script1.content
                });
            });
        });
    });

    describe("configured with empty object options", function () {
        beforeEach(function (done) {
            this.webpack = webpackTestFixture(jasmine)
                .withCssEntryPlugin({}, true)
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

            it("generates a single css bundle with the default filename", function () {
                expect(this.webpack).toOutput({
                    fileCount: 1,
                    file: "main.css",
                    withContent: fixtures.style1.content
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

            it("generates one js bundle and one css bundle with the default filename", function () {
                expect(this.webpack).toOutput({
                    fileCount: 2
                });

                expect(this.webpack).toOutput({
                    file: "style.css",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    file: "script.bundle.js",
                    withContent: fixtures.script1.content
                });
            });
        });
    });
});
