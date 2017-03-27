// TODO: Temporarily disabled
xdescribe("Running CssEntryPlugin with invalid options", function () {
    describe("configured with unsupported options", function () {
        it("fails with invalid options error", function () {
            expect(function () {
                new CssEntryPlugin(10);
            }).toThrowError(CssEntryPluginError, /should be of type string, function or object/);
        });
    });
});
