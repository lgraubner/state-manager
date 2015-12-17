var gulp = require("gulp");
var uglify = require("gulp-uglify");
var header = require("gulp-header");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var rename = require("gulp-rename");
var mochaPhantomjs = require("gulp-mocha-phantomjs");
var pkg = require("./package.json");

var pluginName = "StateManager";

var banner = ["/**",
    " * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>",
    " * Copyright " + new Date().getFullYear() + " <%= pkg.author.name %> - <%= pkg.homepage %>",
    " * License: <%= pkg.license %>",
    " */",
""].join("\n");

gulp.task("build", ["lint"], function() {
    return gulp.src("src/" + pluginName + ".js")
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("lint", function() {
    return gulp.src("src/" + pluginName + ".js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("test", function() {
    return gulp.src("test/runner.html")
        .pipe(mochaPhantomjs({
            reporter: "spec"
        }));
});

gulp.task("default", ["build", "test"]);
