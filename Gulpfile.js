// Include gulp
var gulp = require('gulp');
var del = require('del');

// Include plugins
var plugins = require('gulp-load-plugins')();

var Server = require('karma').Server;

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
  return gulp.src(["protractor/spec/**.js"], { read: false })
    .pipe(plugins.protractor.protractor({
        configFile: "protractor/protractor.conf.js"
    }))
    .on('error', function(e) { throw e; });
  });

gulp.task('disconnect', ['connect', 'protractor'], function() {
  return plugins.connect.serverClose();
});

gulp.task('jshint',function(){
  gulp.src('src/**/*.js')
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter('default'));
});

gulp.task('clean',function(){
  return del(['dist','build']);
});

gulp.task('htmlmin', function() {
  return gulp.src('src/**/*.html')
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/'));
});

gulp.task('uglify', function() {
  return gulp.src('src/**/*.js')
    .pipe(plugins.uglify())
    .pipe(gulp.dest('build/'));
});

gulp.task('cleanCss', function() {
  return gulp.src('styles/*.css')
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest('build/'));
});

gulp.task('minify', ['uglify', 'htmlmin', 'cleanCss']);

// public tasks
gulp.task('unit-test', ['coveralls']);
gulp.task('e2e-test', ['protractor', 'disconnect']);
gulp.task('test', ['unit-test', 'e2e-test']);
