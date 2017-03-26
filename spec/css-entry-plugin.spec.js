describe("CssEntryPlugin", () => {
    beforeEach(cleanOutput);

    it("generates a single output file for a single string entry point", done => {
        testWebpackWithCssEntryPlugin({
            entry: fixtures.style1.path
        }, (err, stats) => {
            expectNoErrorsAndNoWarnings(err, stats);
            expectOutputFileExists(stats);
            expectOutputFileToContain(stats, fixtures.style1.content);
            done();
        });
    });

    it("generates a single output file for a single object entry point", done => {
        testWebpackWithCssEntryPlugin({
            entry: {
                "test": fixtures.style1.path
            }
        }, (err, stats) => {
            expectNoErrorsAndNoWarnings(err, stats);
            expectOutputFileExists(stats, "test");
            expectOutputFileToContain(stats, "test", fixtures.style1.content);
            done();
        });
    });

    it("generates a single output file for a single array entry point (one file path string)", done => {
        testWebpackWithCssEntryPlugin({
            entry: [fixtures.style1.path]
        }, (err, stats) => {
            expectNoErrorsAndNoWarnings(err, stats);
            expectOutputFileExists(stats);
            expectOutputFileToContain(stats, fixtures.style1.content);
            done();
        });
    });

    it("generates a single output file for a single array entry point (two file path strings)", done => {
        testWebpackWithCssEntryPlugin({
            entry: [
                fixtures.style1.path,
                fixtures.style2.path
            ]
        }, (err, stats) => {
            expectNoErrorsAndNoWarnings(err, stats);
            expectOutputFileExists(stats);
            expectOutputFileToContain(stats, [
                ...fixtures.style1.content,
                ...fixtures.style2.content
            ]);
            done();
        });
    });

    it("generates a single output file for a single array entry point (three file path strings)", done => {
        testWebpackWithCssEntryPlugin({
            entry: [
                fixtures.style1.path,
                fixtures.style2.path,
                fixtures.style4.path
            ]
        }, (err, stats) => {
            expectNoErrorsAndNoWarnings(err, stats);
            expectOutputFileExists(stats);
            expectOutputFileToContain(stats, [
                ...fixtures.style1.content,
                ...fixtures.style2.content,
                ...fixtures.style4.content
            ]);
            done();
        });
    });

    it("generates two output files for two string entry points", done => {
        testWebpackWithCssEntryPlugin({
            entry: {
                "test1": fixtures.style1.path,
                "test2": fixtures.style2.path
            }
        }, (err, stats) => {
            expectNoErrorsAndNoWarnings(err, stats);
            expectOutputFileExists(stats, ["test1", "test2"]);
            expectOutputFileToContain(stats, "test1", fixtures.style1.content);
            expectOutputFileToContain(stats, "test2", fixtures.style2.content);
            done();
        });
    });

    it("generates two output files for one string entry point and one array entry point", done => {
        testWebpackWithCssEntryPlugin({
            entry: {
                "test1": fixtures.style1.path,
                "test2": [fixtures.style2.path, fixtures.style4.path]
            }
        }, (err, stats) => {
            expectNoErrorsAndNoWarnings(err, stats);
            expectOutputFileExists(stats, ["test1", "test2"]);
            expectOutputFileToContain(stats, "test1", fixtures.style1.content);
            expectOutputFileToContain(stats, "test2", [
                ...fixtures.style2.content,
                ...fixtures.style4.content
            ]);
            done();
        });
    });

    it("generates two output files for two array entry points", done => {
        testWebpackWithCssEntryPlugin({
            entry: {
                "test1": [fixtures.style1.path, fixtures.style5.path],
                "test2": [fixtures.style2.path, fixtures.style4.path]
            }
        }, (err, stats) => {
            expectNoErrorsAndNoWarnings(err, stats);
            expectOutputFileExists(stats, ["test1", "test2"]);
            expectOutputFileToContain(stats, "test1", [
                ...fixtures.style1.content,
                ...fixtures.style5.content
            ]);
            expectOutputFileToContain(stats, "test2", [
                ...fixtures.style2.content,
                ...fixtures.style4.content
            ]);
            done();
        });
    });

    describe("when css entry chunks share modules", () => {
        describe("and one entry point is a single string path", () => {
            it("generates two output files that both have a common module", done => {
                testWebpackWithCssEntryPlugin({
                    entry: {
                        "test1": [fixtures.style1.path, fixtures.style5.path],
                        "test2": fixtures.style1.path
                    }
                }, (err, stats) => {
                    expectNoErrorsAndNoWarnings(err, stats);
                    expectOutputFileExists(stats, ["test1", "test2"]);
                    expectOutputFileToContain(stats, "test1", [
                        ...fixtures.style1.content,
                        ...fixtures.style5.content
                    ]);
                    expectOutputFileToContain(stats, "test2", fixtures.style1.content);
                    done();
                });
            });
        });

        it("generates two output files that both have a common module", done => {
            testWebpackWithCssEntryPlugin({
                entry: {
                    "test1": [fixtures.style1.path, fixtures.style5.path],
                    "test2": [fixtures.style1.path, fixtures.style4.path]
                }
            }, (err, stats) => {
                expectNoErrorsAndNoWarnings(err, stats);
                expectOutputFileExists(stats, ["test1", "test2"]);
                expectOutputFileToContain(stats, "test1", [
                    ...fixtures.style1.content,
                    ...fixtures.style5.content
                ]);
                expectOutputFileToContain(stats, "test2", [
                    ...fixtures.style1.content,
                    ...fixtures.style4.content
                ]);
                done();
            });
        });

        it("generates three output files of which all have a common module", done => {
            testWebpackWithCssEntryPlugin({
                entry: {
                    "test1": [fixtures.style5.path, fixtures.style1.path],
                    "test2": [fixtures.style1.path, fixtures.style4.path],
                    "test3": [fixtures.style2.path, fixtures.style1.path]
                }
            }, (err, stats) => {
                expectNoErrorsAndNoWarnings(err, stats);
                expectOutputFileExists(stats, ["test1", "test2", "test3"]);
                expectOutputFileToContain(stats, "test1", [
                    ...fixtures.style1.content,
                    ...fixtures.style5.content
                ]);
                expectOutputFileToContain(stats, "test2", [
                    ...fixtures.style1.content,
                    ...fixtures.style4.content
                ]);
                expectOutputFileToContain(stats, "test3", [
                    ...fixtures.style1.content,
                    ...fixtures.style2.content
                ]);
                done();
            });
        });

        it("generates four output files of which all have a common module", done => {
            testWebpackWithCssEntryPlugin({
                entry: {
                    "test1": [fixtures.style5.path, fixtures.style1.path],
                    "test2": [fixtures.style1.path, fixtures.style4.path],
                    "test3": [fixtures.style2.path, fixtures.style1.path],
                    "test4": fixtures.style1.path
                }
            }, (err, stats) => {
                expectNoErrorsAndNoWarnings(err, stats);
                expectOutputFileExists(stats, ["test1", "test2", "test3", "test4"]);
                expectOutputFileToContain(stats, "test1", [
                    ...fixtures.style1.content,
                    ...fixtures.style5.content
                ]);
                expectOutputFileToContain(stats, "test2", [
                    ...fixtures.style1.content,
                    ...fixtures.style4.content
                ]);
                expectOutputFileToContain(stats, "test3", [
                    ...fixtures.style1.content,
                    ...fixtures.style2.content
                ]);
                expectOutputFileToContain(stats, "test4", fixtures.style1.content);
                done();
            });
        });

        it("generates four output files of which pairs of two have a common module", done => {
            testWebpackWithCssEntryPlugin({
                entry: {
                    "test1": [fixtures.style1.path, fixtures.style2.path],
                    "test2": [fixtures.style2.path, fixtures.style4.path],
                    "test3": [fixtures.style4.path, fixtures.style5.path],
                    "test4": [fixtures.style5.path, fixtures.style1.path]
                }
            }, (err, stats) => {
                expectNoErrorsAndNoWarnings(err, stats);
                expectOutputFileExists(stats, ["test1", "test2", "test3", "test4"]);
                expectOutputFileToContain(stats, "test1", [
                    ...fixtures.style1.content,
                    ...fixtures.style2.content
                ]);
                expectOutputFileToContain(stats, "test2", [
                    ...fixtures.style2.content,
                    ...fixtures.style4.content
                ]);
                expectOutputFileToContain(stats, "test3", [
                    ...fixtures.style4.content,
                    ...fixtures.style5.content
                ]);
                expectOutputFileToContain(stats, "test4", [
                    ...fixtures.style5.content,
                    ...fixtures.style1.content
                ]);
                done();
            });
        });
    });

    // TODO: Different files import same file
    // TODO: Same file in multiple entries, imports a file
});
