var gulp = require('gulp'),
  clean = require('del'),
  jade = require('gulp-jade'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  sass = require('gulp-sass'),
  minify = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  livereload = require('gulp-livereload'),
  tinylr = require('tiny-lr'),
  express = require('express'),
  connect = require('connect-livereload'),
  lrs_port = 35729,
  xps_port = 5000;

var livereload_server = tinylr(),
  static_server = express();

static_server.use(connect({
  port: lrs_port
}));
static_server.use(
  express.static('./public')
);

gulp.task('clean', function () {
  clean([ './public/css' ]);
  clean([ './public/js' ]);
  clean([ './tmp' ]);
});

gulp.task('jade', function () {
  return gulp.src('./src/index.jade')
    .pipe(jade({
      data: {
        title: 'React to Bacon'
      }
    }))
    .pipe(gulp.dest('./public'))
    .pipe(livereload(livereload_server));
});

gulp.task('es6', function () {
  return gulp.src('./src/app.jsx')
    .pipe(browserify({
      extensions: [ '.js', '.jsx' ],
      transform: [ 'babelify' ],
      debug: true
    }))
    .pipe(jshint())
    .pipe(gulp.dest('./tmp'))
    .pipe(rename({suffix: '.min', extname: '.js'}))
    //.pipe(uglify())
    .pipe(gulp.dest('./public/js'))
    .pipe(livereload(livereload_server));
});

gulp.task('sass', function () {
  return gulp.src('./src/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./tmp'))
    .pipe(rename({suffix: '.min', extname: '.css'}))
    //.pipe(minify({keepSpecialComments: 0}))
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload(livereload_server));
});

gulp.task('static', function () {
  return gulp.src('./node_modules/bootstrap-sass/assets/fonts/bootstrap/*.*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('build', ['static', 'jade', 'es6', 'sass'], function(cb) {
  cb();
});

gulp.task('watch', function (cb) {
  livereload_server.listen();
  gulp.watch('./src/index.jade', ['jade']);
  gulp.watch([ './src/**/*.jsx' ], ['es6']);
  gulp.watch('./src/*.scss', ['sass']);
  cb();
});

gulp.task('serve', function () {
  static_server.listen(xps_port);
  livereload_server.listen(lrs_port);
});

gulp.task('default', ['clean', 'build', 'serve', 'watch'], function () {
  console.log('Gulp and running!');
});
