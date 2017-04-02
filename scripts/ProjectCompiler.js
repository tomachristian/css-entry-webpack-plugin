const fs = require("fs");
const path = require("path");

const gulp = require("gulp");
const gulpif = require("gulp-if");
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");

const projectFilename = "project.json",
      tsconfigFilename = "tsconfig.json";

const defaultTsReporter = ts.reporter.fullReporter();

const { loadConfigFile, normalizeProjectConfig } = require("./config");

class ProjectCompiler {
    constructor(projectConfig, extraConfig) {
        this.config = normalizeProjectConfig(projectConfig, extraConfig);

        this.tsReporter = defaultTsReporter;
        this.tsProject = this.createTsProject();
    }

    createTsProject() {
        if (this.config.tsconfig) {
            return ts.createProject(
                path.resolve(this.config.tsconfig.$dir, this.config.tsconfig.extends) + ".json",
                this.config.tsconfig.compilerOptions);
        }

        return null;
    }

    src(options) {
        let globs = this.config.include
            .map(glob => path.join(this.config.rootDir, glob));
        return gulp.src(globs, options);
    }

    build() {
        let build = this.src()
            .pipe(gulpif(this.config.sourcemaps, sourcemaps.init()));

        if (this.tsProject) {
            build = build.pipe(this.tsProject(this.tsReporter));
        }

        return build.js
            .pipe(babel(this.config.babelconfig))
            .pipe(gulpif(this.config.sourcemaps, sourcemaps.write("./", {
                mapSources: (sourcePath, file) => {
                    return path.resolve(outDir, sourcePath);
                }
            })));
    }
}

module.exports = ProjectCompiler;
