var gulp        = require('gulp');
var browser     = require('browser-sync').create();
var markdown    = require('gulp-markdown');

// import task
const img = require("./gulp-tasks/images.js");

// Convert files to html
gulp.task('cmarkdown', () =>
    gulp.src('src/markdown/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('dist'))
);

// Static server
gulp.task('server', gulp.series('cmarkdown', img.resize, function() {
    browser.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch("src/markdown/*.md").on("change", gulp.series('cmarkdown', browser.reload));
    gulp.watch("src/img/*").on("change", gulp.series(img.resize, browser.reload));

}));

const build = img.resize;

exports.build = build;

