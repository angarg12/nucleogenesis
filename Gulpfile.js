// Include gulp
var gulp = require('gulp');

// Include plugins
var plugins = require('gulp-load-plugins')();

var Server = require('karma').Server;

console.log(plugins);

gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/jasmine/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('coveralls', ['karma'], function() {
  return gulp.src('jasmine/coverage/**/lcov.info')
    .pipe(plugins.coveralls());
});

gulp.task('connect', function() {
  return plugins.connect.server({
    root: '.',
    port: 9000
  });
});

gulp.task('webdriver_update', plugins.protractor.webdriver_update_specific({
	browsers: ['ignore_ssl']
}));

gulp.task('protractor', ['connect', 'webdriver_update'], function() {
  gulp.src(["protractor/spec/**.js"], { read: false })
    .pipe(plugins.protractor.protractor({
        configFile: "protractor/protractor.conf.js"
    }))
    .on('error', function(e) { throw e });
  });

gulp.task('unit-test', ['coveralls']);
gulp.task('e2e-test', ['protractor']);
gulp.task('test', ['unit-test', 'e2e-test']);
