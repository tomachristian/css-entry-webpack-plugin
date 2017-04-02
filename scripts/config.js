const fs = require("fs");
const path = require("path");

const projectFilename = "project.json",
      tsconfigFilename = "tsconfig.json";

function loadConfigFile(configFilePath) {
    if (!configFilePath) throw new Error("No project config file path specified");

    var config = {};
    try {
         config = require(configFilePath);
    }
    catch (e) {
        throw new Error(
            "Failed to load project config from the specified path\n" +
            e.toString());
    }

    if (typeof config !== "object") {
        throw new Error("Invalid project config format");
    }

    if (!config.rootDir) {
        config.rootDir = path.resolve(path.dirname(configFilePath));
    }

    return config;
}

function normalizeProjectConfig(projectConfig, extraConfig) {
    if (!projectConfig) throw new Error("No project config file path or objet specified");
    if (typeof projectConfig === "string") {
        var stats = fs.lstatSync(projectConfig);

        if (stats.isFile()) {
            projectConfig = loadConfigFile(projectConfig);
        }
        else if (stats.isDirectory()) {
            projectConfig = loadConfigFile(path.join(projectConfig, projectFilename));
        }
    }

    if (typeof projectConfig !== "object") {
        throw new Error("Invalid project config format");
    }

    if (typeof extraConfig === "object") {
        projectConfig = Object.assign(projectConfig, extraConfig);
    }

    if (!projectConfig.rootDir) {
        projectConfig.rootDir = path.resolve(__dirname, "../");
    }

    var tsconfigPath = path.resolve(projectConfig.rootDir, tsconfigFilename);

    if (fs.existsSync(tsconfigPath)) {
        projectConfig.tsconfig = require(tsconfigPath);
        projectConfig.tsconfig.$dir = path.dirname(tsconfigPath);
        projectConfig.tsconfig.$file = tsconfigPath;
    }

    if (!projectConfig.include && projectConfig.tsconfig.include) {
        projectConfig.include = projectConfig.tsconfig.include;
    }

    if (!projectConfig.babelconfig && projectConfig.env) {
        projectConfig.babelconfig = {
            presets: [
                ["env", projectConfig.env]
            ]
        };

        delete projectConfig.env;
    }

    return projectConfig;
}

module.exports = {
    loadConfigFile,
    normalizeProjectConfig
};
