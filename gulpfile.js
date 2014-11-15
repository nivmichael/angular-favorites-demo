var gulp = require('gulp');
var concat = require('gulp-concat');
var streamqueue = require('streamqueue');

// the order of the files being loaded is important in this app
gulp.task('build', function () {
    streamqueue({ objectMode: true },
        gulp.src('src/taskControl.js'),
        gulp.src('src/services/storage.service.js'),
        gulp.src('src/services/logManager.service.js'),
        gulp.src('src/controllers/*.js'),
        gulp.src('src/filters/*.js'),
        gulp.src('src/config.js')
    )
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/'));
});


// run build once and set a watcher
gulp.task('default', ['build'], function () {
    gulp.watch('src/**/*.js', ['build']);
});