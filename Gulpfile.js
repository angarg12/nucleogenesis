/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

// Include gulp
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');

// Include plugins
var plugins = require('gulp-load-plugins')();

var Server = require('karma').Server;

// unit test
gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/test/unit/karma.conf.js',
    singleRun: true
  }, done).start();
});

// coverage
gulp.task('coveralls', function() {
  return gulp.src('test/unit/coverage/**/lcov.info')
    .pipe(plugins.coveralls());
});

// e2e test
gulp.task('connect', function() {
  return plugins.connect.server({
    root: 'build/',
    port: 9000
  });
});

gulp.task('webdriver_update', plugins.protractor.webdriver_update_specific({
	browsers: ['ignore_ssl']
}));

gulp.task('protractor', ['connect', 'webdriver_update'], function() {
  return gulp.src(["test/integration/spec/**.js"], { read: false })
    .pipe(plugins.protractor.protractor({
        configFile: "test/integration/protractor.conf.js"
    }))
    .on('error', function(e) { throw e; });
  });

gulp.task('disconnect', function() {
  return plugins.connect.serverClose();
});

// linting
gulp.task('jshint',function(){
  gulp.src('src/**/*.js')
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter('default'));
});

// clean
gulp.task('clean',function(){
  return del(['dist','build']);
});

// minify
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

// dependencies

gulp.task('bower', function() {
  return plugins.bower();
});

// copy
gulp.task('copy-js', function() {
  return gulp.src('src/scripts/**')
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('copy-data', function() {
  return gulp.src('src/data/**')
    .pipe(gulp.dest('build/data'));
});

gulp.task('copy-html', function() {
  return gulp.src('src/html/**')
    .pipe(gulp.dest('build/'));
});

gulp.task('copy-css', function() {
  return gulp.src('src/styles/**')
    .pipe(gulp.dest('build/styles'));
});

gulp.task('copy-lib', function() {
  return gulp.src('bower_components/**')
    .pipe(gulp.dest('build/bower_components'));
});

gulp.task('copy-build', ['copy-js',  'copy-data', 'copy-html',
                        'copy-css', 'copy-lib']);

// build

gulp.task('populate_player', function() {
  return plugins.run('node build_scripts/populate_player.js build',{silent:true}).exec()
  .pipe(plugins.rename("start_player.json"))
  .pipe(gulp.dest('build/data'));
});

gulp.task('populate_data', function() {
  return plugins.run('node build_scripts/populate_data.js build',{silent:true}).exec();
});

gulp.task('generate_isotopes', function() {
  return plugins.run('node build_scripts/generate_isotopes.js build',{silent:true}).exec();
});

gulp.task('generate_syntheses', function() {
  return plugins.run('node build_scripts/generate_syntheses.js build',{silent:true}).exec();
});

gulp.task('generate_achievement_functions', function() {
  return plugins.run('node build_scripts/generate_achievement_functions.js build',{silent:true}).exec();
});

gulp.task('babel', function() {
  return gulp.src(['build/scripts/modules/*.js',
    'build/scripts/*.js',
    'build/scripts/config/*.js',
    'build/scripts/services/*.js',
    'build/scripts/controllers/*.js'])
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(plugins.concat('app.min.js'))
    .pipe(gulp.dest('build/scripts'));
});

// public tasks
gulp.task('build', function(callback) {
  runSequence(
    'clean',
    'bower',
    'copy-build',
    'generate_isotopes',
    'generate_syntheses',
    'generate_achievement_functions',
    'populate_player',
    'populate_data',
    'babel',
    callback);
});

gulp.task('unit-test', function(callback) {
  runSequence('build', 'karma', 'coveralls',
              callback);
});

gulp.task('e2e-test', function(callback) {
  runSequence('build', 'protractor', 'disconnect',
              callback);
});

gulp.task('test', ['unit-test', 'e2e-test']);
