describe("Running CssEntryPlugin with invalid options", () => {
    describe("configured with unsupported options", () => {
        it("fails with invalid options error", () => {
            expect(() => {
                new CssEntryPlugin(10);
            }).toThrowError(CssEntryPluginError, /should be of type string, function or object/);
        });
    });
});
