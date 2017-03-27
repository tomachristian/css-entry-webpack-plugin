describe("Running CssEntryPlugin with shorthand output filename option", function () {
    beforeEach(function (done) {
        this.webpack = webpackTestFixture(jasmine)
            .cleanOutput(done);
    });

    describe("configured with a path template", function () {
        beforeEach(function (done) {
            this.webpack = webpackTestFixture(jasmine)
                .withCssEntryPlugin("[name].spec.bundle.css", true)
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

            it("generates a single css bundle with the configured filename", function () {
                expect(this.webpack).toOutput({
                    fileCount: 1,
                    file: "main.spec.bundle.css",
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

            it("generates one js bundle and one css bundle with the configured filename", function () {
                expect(this.webpack).toOutput({
                    fileCount: 2
                });

                expect(this.webpack).toOutput({
                    file: "style.spec.bundle.css",
                    withContent: fixtures.style1.content
                });

                expect(this.webpack).toOutput({
                    file: "script.bundle.js",
                    withContent: fixtures.script1.content
                });
            });
        });
    });

    describe("configured with a function", function () {
        beforeEach(function (done) {
            this.webpack = webpackTestFixture(jasmine)
                .withCssEntryPlugin(function (getPath) { return "prefix-" + getPath("[name].spec.bundle.css"); }, true)
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

            it("generates a single css bundle with the configured filename", function () {
                expect(this.webpack).toOutput({
                    fileCount: 1,
                    file: "prefix-main.spec.bundle.css",
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

            it("generates one js bundle and one css bundle with the configured filename", function () {
                expect(this.webpack).toOutput({
                    fileCount: 2
                });

                expect(this.webpack).toOutput({
                    file: "prefix-style.spec.bundle.css",
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
