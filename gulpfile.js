var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

var paths = {
  scss: ['./scss/*.scss'],
   css: './css'
};

var changeEvent = function(evt) {
  $.util.log('File', $.util.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + '/source' + ')/'), '')), 'was', $.util.colors.magenta(evt.type));
};

// Sass
gulp.task('styles', function() {
  gulp.src(paths.scss)
    .pipe($.size())
    //.pipe($.sourcemaps.init())
    .pipe($.using())
    .pipe($.sass({
      outputStyle: "compressed",
      onError: function(error) {
        $.util.beep();
        $.util.log("\n\n[" + $.util.colors.green("gulp-sass") +"]\n" + $.util.colors.cyan(error.message) + " on " + $.util.colors.yellow("line " + error.line) + " in\n" + error.file);
      }
    }))
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.css))
    .pipe($.filter('*.css'))
    .pipe(reload({
      stream: true
    }));
});


// BrowserSync
gulp.task("browsersync", function() {
  browserSync({
    proxy: "demo.dev",
    ui: {
      port: 8080
    },
    debugInfo: true
  });
});

// Watch
gulp.task('watch', ['styles', 'browsersync'], function() {
  gulp.watch(paths.scss, ['styles']).on('change', function(evt) {
    changeEvent(evt);
  });
});


// Default
gulp.task('default', ['watch']);
