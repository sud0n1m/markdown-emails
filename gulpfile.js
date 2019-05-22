var gulp        = require('gulp');
var browser     = require('browser-sync').create();
var markdown    = require('gulp-markdown');

// Convert files to html
gulp.task('cmarkdown', () =>
    gulp.src('markdown/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('html'))
);

// Static server
gulp.task('server', gulp.series('cmarkdown', function() {
    browser.init({
        server: {
            baseDir: "html"
        }
    });
    gulp.watch("markdown/*.md").on("change", gulp.series('cmarkdown', browser.reload));

}));