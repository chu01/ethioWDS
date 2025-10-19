const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

gulp.task('build-assets', function() {
  return gulp.src('src/assets/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/images'));
});
gulp.task('copy-fonts', function() {
  return gulp.src('src/assets/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('copy-icons', function() {
  return gulp.src('src/assets/icons/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/icons'));
});

gulp.task('build-assets', gulp.parallel('copy-fonts', 'copy-icons'));
