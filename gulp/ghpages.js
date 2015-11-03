var ghPages = require('gulp-gh-pages');

module.exports = function(gulp, plugins, args, config, taskTarget, browserSync) {

  gulp.task('ghpages', function(done) {
    return gulp.src(taskTarget + '/**/*')
      .pipe(ghPages());
  });
};
