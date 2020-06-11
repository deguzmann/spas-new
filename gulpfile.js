var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");
var plumber = require("gulp-plumber");
var del = require('del');

var server = require("browser-sync").create();
var minify = require("gulp-csso");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

var paths = {
  styles: {
    src: 'source/sass/style.scss',
    dest: 'build/assets/css/'
  },
  scripts: {
    src: 'source/js/**/*.js',
    dest: 'build/assets/js/'
  }
};

sass.compiler = require('node-sass');

function clean() {
  return del([ 'build' ]);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    //.pipe(concat('style.css'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    /*.pipe(babel())*/
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(server.stream());
}

function html() {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
}

function copy() {
  return gulp.src([
    "source/img/**",
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch("source/*.html", html).on("change", server.reload);
});


/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts, html, copy));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.copy = copy;
exports.watch = watch;
exports.build = build;

/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
