const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const plumber = require("gulp-plumber");
const del = require('del');

const server = require("browser-sync").create();
const minify = require("gulp-csso");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");

const paths = {
  styles: {
    src: 'source/sass/style.scss',
    dest: 'build/assets/css/'
  },
  scripts: {
    src: 'source/js/**/*.js',
    dest: 'build/assets/js/',
    main: 'source/js/app.js'
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
    .pipe(plumber())
    .pipe(babel())
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
  gulp.watch(paths.scripts.main, scripts);
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
  gulp.watch(paths.scripts.main, scripts);
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
