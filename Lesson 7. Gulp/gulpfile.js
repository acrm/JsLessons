var gulp = require('gulp');
var pump = require('pump');

var jshint = require('gulp-jshint');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

gulp.task('lint1', function() {
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('lint2', () => {
  return gulp.src(['js/*.js'])
      .pipe(eslint());
});

gulp.task('default', ['lint'], () => {
  // This will only run if the lint task is successful...
});

gulp.task('sass', () => {
  return gulp.src('*.scss')
    .pipe(sass())
    .pipe(concat('all.css'))
    .pipe(rename('all.min.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('scripts', (cd) => {
  pump([
    gulp.src('js/*.js'),
    concat('all.js'),
    gulp.dest('dist/js'),
    rename('all.min.js'),
    uglify(),
    gulp.dest('dist/js')
  ], cd);  
});

gulp.task('watch', () => {
  gulp.watch('*.js', ['lint', 'scripts'])
  gulp.watch('*.scss', ['sass'])
});

gulp.task('default', ['lint1', 'lint2', 'sass', 'scripts']);