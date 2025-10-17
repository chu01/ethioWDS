const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

gulp.task('build-assets', function() {
  return gulp.src('src/assets/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('default', gulp.series('build-assets'));