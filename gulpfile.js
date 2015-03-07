var gulp         = require('gulp'),
    $            = require('gulp-load-plugins')(),
    browserSync  = require('browser-sync'),
    pngquant     = require('imagemin-pngquant'),
    reload       = browserSync.reload,
    production   = true,
    prefixes     = ['last 2 version', 'safari 5', 'ie 8', 'opera 12.1', 'ios 6', 'android 4', 'Firefox >= 4'],
    cssStyle     = "compressed",
    bsProxy      = "demo.dev";

if ($.util.env.dev === true) {
  production = false,
  cssStyle   = "nested";
}

var changeEvent = function(evt) {
  $.util.log('File', $.util.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + '/source' + ')/'), '')), 'was', $.util.colors.magenta(evt.type));
};

var paths = {
  images: {
      src: 'img/**/*.{jpg,jpeg,png,gif,svg}',
     dest: 'build/img/'
  },
  scripts: {
      src: 'js/**/*.js',
     skip: '',
     dest: 'build/js/'
  },
  styles: {
      src: 'scss/**/*.scss',
     dest: 'build/css'
  }
};


// Styles
gulp.task('styles', function() {
  gulp.src(paths.styles.src)
    .pipe($.sourcemaps.init())
    .pipe($.size())
    .pipe($.sass({
      outputStyle: cssStyle,
      onError: function(error) {
        $.util.beep();
        $.util.log("\n\n[" + $.util.colors.green("gulp-sass") +"]\n" + $.util.colors.cyan(error.message) + " on " + $.util.colors.yellow("line " + error.line) + " in\n" + error.file);
      }
    }))
    .pipe($.autoprefixer(prefixes))
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe($.filter('*.css'))
    .pipe(reload({ stream: true }));
});


// Images
gulp.task("images", function() {
  gulp.src(paths.images.src)
    .pipe($.using())
    .pipe($.size())
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.images.dest));
});


// Package Scripts
gulp.task('scripts', function () {
  return gulp.src(paths.scripts.src)
    .pipe($.changed(paths.scripts.dest))
    .pipe($.using())
    .pipe(production ? $.uglify() : $.util.noop())
    .pipe($.size({title: 'scripts'}))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe($.filter('*.js'))
    .pipe($.notify('Scripts task complete'))
    .pipe(reload({ stream: true }));
});


// browserSync
gulp.task("browserSync", function() {
  browserSync({
    proxy: bsProxy,
    ui: {
      port: 8080
    },
    debugInfo: true
  });
});



// browserSync Reload
gulp.task('reload', function () {
  reload();
});

// Watch
gulp.task('watch', ['styles', 'scripts', 'images', 'browserSync'], function() {
  gulp.watch(paths.styles.src, ['styles']).on('change', function(evt) {
    changeEvent(evt);
  });
  gulp.watch(paths.scripts.src, ['scripts']).on('change', function(evt) {
    changeEvent(evt);
  });
  gulp.watch(paths.images.src, ['images']).on('change', function(evt) {
    changeEvent(evt);
  });
});


// Default
gulp.task('default', ['watch']);
