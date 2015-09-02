var gulp = require("gulp");
var uglify = require("gulp-uglify");
var header = require("gulp-header");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var size = require("gulp-size");
var pkg = require("./package.json");

var pluginName = pkg.name.replace(/-/g, ".");

var banner = ["/**",
    " * <%= pkg.name %> - v<%= pkg.version %>",
    " * <%= pkg.description %>",
    " * <%= pkg.homepage %>",
    " *",
    " * Copyright <%= pkg.author %>",
    " * Under <%= pkg.license %> License",
    " */",
""].join("\n");

gulp.task("build", function() {
    return gulp.src(["src/matchMedia.js", "src/" + pluginName + ".js"])
        .pipe(concat(pluginName + ".min.js"))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(size({ gzip: true }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("lint", function() {
    return gulp.src("src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("default", ["lint", "build"]);
