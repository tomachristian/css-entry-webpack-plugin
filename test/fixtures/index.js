module.exports = {
    script1: {
        path: "./script1.js",
        content: [`console.log("script1")`]
    },
    script2: {
        path: "./script2.js",
        content: [`console.log("script2")`]
    },

    image1: {
        path: "./images/img1.png"
    },

    style1WithImg1: {
        path: "./styles/style1-with-img1.css",
        content: ["style1-img1-class"],
        img1: {
            file: "img1.png"
        }
    },
    style2WithImg1: {
        path: "./styles/style2-with-img1.css",
        content: ["style2-img1-class"],
        img1: {
            file: "img1.png"
        }
    },
    style1WithImg2: {
        path: "./styles/style1-with-img2.css",
        content: ["style1-img2-class"],
        img2: {
            file: "img2.png"
        }
    },

    style1WithImport1: {
        path: "./styles/style1-with-import1.css",
        content: ["style1-import1-class"],
        import1: {
            file: "style1.css"
        }
    },

    scss: {
        style1: {
            path: "./styles/style1.scss",
            content: ["style1-class", ".style1-class .style1-sub-class"]
        }
    },

    style1: {
        path: "./styles/style1.css",
        content: ["style1-class"]
    },
    style2: {
        path: "./styles/style2.css",
        content: ["style2-class"]
    },
    style4: {
        path: "./styles/style4.css",
        content: ["style4-class"]
    },
    style5: {
        path: "./styles/style5.css",
        content: ["style5-class"]
    }
};
