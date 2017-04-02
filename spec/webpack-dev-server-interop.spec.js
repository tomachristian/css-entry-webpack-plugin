const Server = require("webpack-dev-server/lib/Server");
const finishTestcase = require("jasmine-supertest");

describe("Running CssEntryPlugin with webpack-dev-server", function () {
    beforeEach(function (done) {
        this.webpack = webpackTestFixture(jasmine)
            .withCssEntryPlugin()
            .cleanOutput(done);
    });

    afterEach(function (done) {
        this.webpack.close(done);
    });

    const testCases = [
        {
            name: "configured with two single entries (1: .js, 2: .css) " +
                  "generates one css bundle and one js bundle",
            config: {
                entry: {
                    "test1": fixtures.script1.path,
                    "test2": fixtures.style1.path
                }
            },
            output: {
                files: [
                    {
                        file: "test1.bundle.js",
                        content: fixtures.script1.content
                    },
                    {
                        file: "test2.bundle.css",
                        content: fixtures.style1.content
                    },
                    "!test2.bundle.js"
                ]
            }
        },
        {
            name: "configured with two single entries (1: .css, 2: .css) " +
                  "generates two css bundles",
            config: {
                entry: {
                    "test1": fixtures.style1.path,
                    "test2": fixtures.style2.path
                }
            },
            output: {
                files: [
                    {
                        file: "test1.bundle.css",
                        content: fixtures.style1.content
                    },
                    {
                        file: "test2.bundle.css",
                        content: fixtures.style2.content
                    },
                    "!test1.bundle.js",
                    "!test2.bundle.js"
                ]
            }
        },
        {
            name: "configured with two single entries with same file (1: 1.css, 2: 1.css) " +
                  "generates two css bundles with the same css",
            config: {
                entry: {
                    "test1": fixtures.style1.path,
                    "test2": fixtures.style1.path
                }
            },
            output: {
                files: [
                    {
                        file: "test1.bundle.css",
                        content: fixtures.style1.content
                    },
                    {
                        file: "test2.bundle.css",
                        content: fixtures.style1.content
                    },
                    "!test1.bundle.js",
                    "!test2.bundle.js"
                ]
            }
        }
    ];

    testCases.forEach(testCase => {
        it(testCase.name, function (done) {
            this.webpack.config(testCase.config)
                .serve(() => {
                    const requests = testCase.output.files.map(file => {
                        if (typeof file === "string") {
                            if (file.startsWith("!")) {
                                file = {
                                    exists: false,
                                    file: file.substr(1)
                                };
                            }
                            else {
                                file = {
                                    file
                                };
                            }
                        }

                        return this.webpack.client
                            .get("/" + file.file)
                            .expect(file.exists === false ? 404 : 200)
                            .then(res => {
                                if (file.content) {
                                    file.content.forEach(text => expect(res.text).toContain(text));
                                }
                                return res;
                            });
                    });

                    Promise.all(requests)
                        .then(() => done(),
                              err => done.fail(err));
                });
        });
    });
});
