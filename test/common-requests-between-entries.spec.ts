describe("test", () => {
    it("should succeed", () => {
        "da".should.be("da");
    });

    it("should fail", () => {
        "da".should.be("nu");
    });
});
