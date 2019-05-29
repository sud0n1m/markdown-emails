var gulp        = require('gulp');
var browser     = require('browser-sync').create();
var markdown    = require('gulp-markdown');
var fs          = require('fs');
var config      = JSON.parse(fs.readFileSync('config.json'));
var awspublish  = require("gulp-awspublish");


// import task
const img = require("./gulp-tasks/images.js");

// Convert files to html
gulp.task('cmarkdown', () =>
    gulp.src('src/markdown/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('_build'))
);

// Static server
gulp.task('server', gulp.series('cmarkdown', img.resize, function() {
    browser.init({
        server: {
            baseDir: "_build"
        }
    });
    gulp.watch("src/markdown/*.md").on("change", gulp.series('cmarkdown', browser.reload));
    gulp.watch("src/img/*").on("change", gulp.series(img.resize, browser.reload));

}));

gulp.task("publish", function() {
    // create a new publisher using S3 options
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
    var publisher = awspublish.create(
      {
        
        region: config.aws.region,
        params: {
          Bucket: config.aws.params.Bucket
        },
        credentials: {
            "accessKeyId": config.aws.accessKeyId,
            "secretAccessKey": config.aws.secretAccessKey,
            "signatureVersion": "v3"
        }
      },
      {
        cacheFileName: "cache"
      }
    );
   
    // define custom headers
    var headers = {
      "Cache-Control": "max-age=315360000, no-transform, public"
      // ...
    };
   
    return (
      gulp
        .src("./_build/img/*")   
        // publisher will add Content-Length, Content-Type and headers specified above
        // If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.publish(headers))
   
        // create a cache file to speed up consecutive uploads
        .pipe(publisher.cache())
   
        // print upload updates to console
        .pipe(awspublish.reporter())
    );
  });

const build = img.resize;

exports.build = build;

