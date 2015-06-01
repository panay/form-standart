//--------------------------------------
// $REQUIREMENTS
//--------------------------------------

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    rimraf = require('gulp-rimraf'),
    replace = require('gulp-replace'),
    inject = require('gulp-inject-string'),
    cmq = require('gulp-combine-media-queries'),
    htmlmin = require('gulp-htmlmin'),
    gulpif = require('gulp-if'),
    jade = require('gulp-jade'),
    svgSprite = require("gulp-svg-sprites"),
    sprite = require('css-sprite').stream,
    filter = require('gulp-filter'),
    sourcemaps = require('gulp-sourcemaps'),
    svgmin = require('gulp-svgmin');

//--------------------------------------
// $VARIABLES
//--------------------------------------

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var development = './';
var production = './build/';

//--------------------------------------
// $BROWSER SYNC
//--------------------------------------

gulp.task('server', function () {
  browserSync({
    server: {
      baseDir: development
    },
    browser: "google chrome",
    files: [development + "css/*.css", development + "*.html", development + "js/**/*.js"],
    open: false
  });
});

//--------------------------------------
// $SASS
//--------------------------------------


gulp.task('sass', function () {
  return gulp.src(development + 'scss/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(prefix(AUTOPREFIXER_BROWSERS))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(development + 'css'))
      .pipe(filter('**/*.css'))
      .pipe(reload({stream: true}));
});

//--------------------------------------
// $JADE
//--------------------------------------

gulp.task('template', function () {
  gulp.src([
    development + 'jade/*.jade'
  ])
      .pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest(development));
});

//--------------------------------------
// $IMAGES
//--------------------------------------

// generate sprite.png and _sprite.scss
gulp.task('sprite', function () {
  return gulp.src('./img/sprite/*.png')
      .pipe(sprite({
        name: 'sprite',
        retina: true,
        style: '_sprite.scss',
        cssPath: '../img',
        orientation: 'binary-tree',
        processor: 'scss'
      }))
      .pipe(gulpif('*.png', gulp.dest(development + 'img/'), gulp.dest(development + 'scss/')));
});


//--------------------------------------
// $SVG
//--------------------------------------

gulp.task('svg-sprite', function () {
  return gulp.src('img/svg/*.svg')
//.pipe(svgmin())
      .pipe(svgSprite({
        mode: 'symbols',
        svg: {
          symbols: "sprite.svg"
        }
      }))
      .pipe(gulp.dest(development + 'img'));
});

// Задачи по-умолчанию при старте командой 'gulp'
// + задачи на отслеживание изменившихся файлов

gulp.task('watch', function () {
  gulp.watch(development + 'scss/*.scss', ['sass']);
  gulp.watch(development + 'jade/*.jade', ['template']);
  gulp.watch(development + '_includes/*.jade', ['template']);
  gulp.watch(development + '_layouts/*.jade', ['template']);
  gulp.watch(development + 'img/svg/*.svg', ['svg-sprite']);
  gulp.watch(development + 'img/sprite/*.png', ['sprite']);
});

gulp.task('default', ['watch', 'server']);

//--------------------------------------
// $BUILD
//--------------------------------------

gulp.task('clean', function () {
  return gulp.src([
    production
  ])
      .pipe(rimraf());
});


// HTML
gulp.task('copy-html', function () {
  return gulp.src(development + '*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(production));
});

// JS
gulp.task('copy-js', function () {
  return gulp.src(development + 'js/*.js')
//.pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest(production + 'js'));
});

// CSS
gulp.task('copy-css', function () {
  return gulp.src(development + 'css/*.css')
//.pipe(concat('main.css'))
      .pipe(cmq())
      .pipe(csso())
      .pipe(prefix(AUTOPREFIXER_BROWSERS))
      .pipe(gulp.dest(production + 'css'));
});

// IMG
gulp.task('copy-assets', function () {
  return gulp.src([
    development + 'img/**/*',
    '!' + development + 'img/svg',
    '!' + development + 'img/sprite',
    '!' + development + 'img/svg-symbols.svg'
  ])
      .pipe(imagemin({
        progressive: true,
        interlaced: true
      }))
      .pipe(gulp.dest(production + 'img'));
});

gulp.task('build', function (callback) {
  runSequence(
      'clean',
      ['copy-html',
        'copy-js',
        'copy-css',
        'copy-assets'],
      callback);
});


