const path = require("path");

const merge = require("merge2");

const gulp = require("gulp");
const gulpif = require("gulp-if");
const util = require("gulp-util");
const clean = require("gulp-clean");
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
//const jasmine = require("gulp-jasmine");
const mocha = require("gulp-mocha");
const shell = require("gulp-shell");
//const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

const ProjectCompiler = require("./scripts/ProjectCompiler");

// TODO: jslint
const outDir = path.join(__dirname, "lib"),
      tmpDir = path.join(__dirname, "tmp"),
      specsDir = path.join(__dirname, "spec"),
      testDir = path.join(__dirname, "test"),
      srcDir = path.join(__dirname, "src");

let tsProject, tsReporter;

const buildConfig = {
    // Disables the clean process
    dirty: !!util.env.dirty,
    // Disabled new builds
    fast: !!util.env.fast,
    sourcemaps: !!util.env.sourcemaps,
    cover: !!util.env.cover
}

// Cover requires sourcemaps
if (buildConfig.cover) buildConfig.sourcemaps = true;

if (buildConfig.dirty) {
    console.log("> Dirty build");
}
if (buildConfig.fast) {
    console.log("> Fast build");
}
if (buildConfig.sourcemaps) {
    console.log("> Sourcemaps enabled");
}
if (buildConfig.cover) {
    console.log("> Code coverage enabled");
}

gulp.task("clean:lib", () => {
    return gulp.src(outDir, { read: false, allowEmpty: true })
        .pipe(gulpif(!buildConfig.dirty, clean()));
});

gulp.task("clean:tmp", () => {
    return gulp.src(tmpDir, { read: false, allowEmpty: true })
        .pipe(gulpif(!buildConfig.dirty, clean()));
});

gulp.task("clean", gulp.parallel("clean:lib", "clean:tmp"));

gulp.task("build", gulp.series("clean", () => {
    if (buildConfig.fast) {
        return Promise.resolve();
    }

    if (!tsProject) {
        tsProject = ts.createProject(
            "tsconfig.json",
            require(path.join(srcDir, "tsconfig.json")).compilerOptions);
        tsReporter = ts.reporter.fullReporter();
    }

    const build = tsProject.src()
        .pipe(gulpif(buildConfig.sourcemaps, sourcemaps.init()))
        .pipe(tsProject(tsReporter));

    return merge([
        build.js
            .pipe(babel())
            .pipe(gulpif(buildConfig.sourcemaps, sourcemaps.write("./", {
                mapSources: (sourcePath, file) => {
                    return path.resolve(outDir, sourcePath);
                }
            })))
            .pipe(gulp.dest(outDir)),

        build.dts
            .pipe(gulp.dest(outDir))
    ]);
}));

gulp.task("watch", gulp.series("build", function watch(_) {
    buildConfig.dirty = true;
    buildConfig.fast = false;
    gulp.watch(path.join(srcDir, "**/*"), { mode: "poll" }, gulp.series("build"));
}));

// Builds the tests
gulp.task("build:test", () => {
    if (buildConfig.fast) {
        return Promise.resolve();
    }

    var test = new ProjectCompiler(testDir);
    return test.build()
        .pipe(gulp.dest(path.join(tmpDir, "test")));
});

gulp.task("test:cover", shell.task("nyc -c false gulp test --dirty --fast"));
gulp.task("test", gulp.series("build", "build:test", buildConfig.cover ? gulp.series("test:cover") : function test() {
    /*const config = require(path.join(specsDir, "support/jasmine.json"));
    const reporter = new SpecReporter({
        spec: {
            displayPending: true,
            displayDuration: true,
            displaySuccessful: true,
            displayFailed: true,
            displayErrorMessages: true,
            displayStacktrace: true
        }
    });
    // TODO: Load glob from spec/support/jasmine.json (config)
    return gulp.src(path.join(specsDir, "**//*.spec.js"))
        .pipe(jasmine({
            config: config,
            reporter: reporter
        }));*/

    return gulp.src(path.join(tmpDir, "test", "**/*.spec.js"), { read: false })
        .pipe(mocha({
            require: path.join(specsDir, "helpers/common.js")
            //reporter: "nyan"
        }));
}));

gulp.task("dev", gulp.series("watch"));
gulp.task("default", gulp.series("build"));
