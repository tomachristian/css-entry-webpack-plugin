import fs from "fs";
import path from "path";

const defaultProjectConfigFilename = "project.json",
      defaultTypeScriptConfigFilename = "tsconfig.json";

export default class ProjectConfiguration {
    constructor(...configs) {
        this.babelconfig = {};
        this.tsconfig = {};

        this.merge(...configs);
    }

    merge(...configs) {
        this.config = ProjectConfiguration.merge(this.config, ...configs);
        this.normalize();
    }

    normalize() {
        if (!this.config.tsconfig) {
            var tsconfigPath = path.resolve(this.config.rootDir, defaultTypeScriptConfigFilename);

            if (fs.existsSync(tsconfigPath)) {
                this.tsconfig = require(tsconfigPath);
                this.tsconfig.$dir = path.dirname(tsconfigPath);
                this.tsconfig.$file = tsconfigPath;
            }
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

    static load(configPath) {
        configPath = ProjectConfiguration.resolveConfigFilePath(configPath);

        var config = {};
        try {
            config = require(configPath);
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
            config.rootDir = path.resolve(path.dirname(configPath));
        }

        return new ProjectConfiguration(config);
    }

    static resolveConfigFilePath(configPath) {
        if (!configPath) throw new Error("No config path specified");
        if (typeof configPath !== "string") throw new Error("Invalid config path specified");

        try {
            var stats = fs.lstatSync(configPath);

            if (stats.isFile()) {
                return path.resolve(configPath);
            }
            else if (stats.isDirectory()) {
                return path.resolve(configPath, defaultProjectConfigFilename);
            }
        }
        catch (err) {
            throw new Error("Config path not found\n" + err);
        }

        throw new Error("Config path not found or invalid");
    }

    static merge(...configs) {
        if (!configs || configs.length === 0) return {};

        configs = configs.filter(config => !!config && typeof config === "object");

        let config = {};
        Object.assign(config, ...configs);
        return config;
    }
}
