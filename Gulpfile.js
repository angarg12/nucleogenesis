/* eslint-env node */
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

// Include gulp
let gulp = require('gulp');
let del = require('del');
let runSequence = require('run-sequence');
let uglifyes = require('uglify-es');
let composer = require('gulp-uglify/composer');

// Include plugins
let plugins = require('gulp-load-plugins')();

let Server = require('karma').Server;
let ugly = composer(uglifyes, console);

// unit test
gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/test/unit/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('codecov', function() {
  return gulp
    .src(['test/unit/coverage/**/lcov.info'], { read: false })
    .pipe(plugins.codeclimateReporter({ token: '8e959350aa2fde657bbdd472964d5b2bdbb7d2ba10b8f6137865f2c241ecc86e' }))
  ;
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
  return gulp.src(['test/integration/spec/**.js'], { read: false })
    .pipe(plugins.protractor.protractor({
        configFile: 'test/integration/protractor.conf.js'
    }))
    .on('error', function(e) { throw e; });
  });

gulp.task('disconnect', function() {
  return plugins.connect.serverClose();
});

// clean
gulp.task('clean',function(){
  return del(['dist','build']);
});

// dist

gulp.task('htmlmin', function() {
  return gulp.src('build/**/*.html')
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('uglify', function() {
  return gulp.src('build/scripts/app.min.js')
    .pipe(ugly())
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('cleanCss', function() {
  return gulp.src('build/**/*.css')
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify', ['uglify', 'htmlmin', 'cleanCss']);

// FIXME can we do this with a parametric task?
gulp.task('copy-lib-dist', function() {
  return gulp.src('bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});

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

gulp.task('copy-build', ['copy-js', 'copy-data', 'copy-html',
                        'copy-css', 'copy-lib']);

// build

gulp.task('populate_player', function() {
  return plugins.run('node build_scripts/populate_player.js',{silent:true}).exec();
});

gulp.task('populate_data', function() {
  return plugins.run('node build_scripts/populate_data.js',{silent:true}).exec();
});

gulp.task('generate_isotopes', function() {
  return plugins.run('node build_scripts/generate_isotopes.js',{silent:true}).exec();
});

gulp.task('generate_resource_matrix', function() {
  return plugins.run('node build_scripts/generate_resource_matrix.js',{silent:true}).exec();
});

gulp.task('generate_decay', function() {
  return plugins.run('node build_scripts/generate_decay.js',{silent:true}).exec();
});

gulp.task('generate_ions', function() {
  return plugins.run('node build_scripts/generate_ions.js',{silent:true}).exec();
});

gulp.task('generate_reactions', function() {
  return plugins.run('node build_scripts/generate_reactions.js',{silent:true}).exec();
});

gulp.task('generate_antimatter', function() {
  return plugins.run('node build_scripts/generate_antimatter.js',{silent:true}).exec();
});

gulp.task('generate_achievements', function() {
  return plugins.run('node build_scripts/generate_achievements.js',{silent:true}).exec();
});

gulp.task('generate_unlocks', function() {
  return plugins.run('node build_scripts/generate_unlocks.js',{silent:true}).exec();
});

gulp.task('generate_achievement_functions', function() {
  return plugins.run('node build_scripts/generate_achievement_functions.js',{silent:false}).exec();
});

gulp.task('generate_upgrades', function() {
  return plugins.run('node build_scripts/generate_upgrades.js',{silent:false}).exec();
});

gulp.task('generate_exotic_upgrades', function() {
  return plugins.run('node build_scripts/generate_exotic_upgrades.js',{silent:false}).exec();
});

gulp.task('generate_exotic_ranges', function() {
  return plugins.run('node build_scripts/generate_exotic_ranges.js',{silent:false}).exec();
});

gulp.task('generate_upgrade_functions', function() {
  return plugins.run('node build_scripts/generate_upgrade_functions.js',{silent:true}).exec();
});

gulp.task('generate_element_slot', function() {
  return plugins.run('node build_scripts/generate_element_slot.js',{silent:true}).exec();
});

gulp.task('sort_resources', function() {
  return plugins.run('node build_scripts/sort_resources.js',{silent:true}).exec();
});

gulp.task('concat', function() {
  return gulp.src(['build/scripts/modules/module.js',
    'build/scripts/**/*!(module.js)'])
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
    'generate_resource_matrix',
    'generate_ions',
    'generate_decay',
    'generate_reactions',
    'generate_antimatter',
    'generate_achievements',
    'generate_unlocks',
    'generate_exotic_upgrades',
    'generate_upgrades',
    'generate_exotic_ranges',
    'generate_achievement_functions',
    'generate_upgrade_functions',
    'generate_element_slot',
    'sort_resources',
    'populate_player',
    'populate_data',
    'concat',
    callback);
});

gulp.task('build-unit-test', function(callback) {
  runSequence('build', 'karma', callback);
});

gulp.task('dist', function(callback) {
  runSequence('build', 'minify', 'copy-lib-dist', callback);
});

gulp.task('unit-test', function(callback) {
  runSequence('dist', 'karma', 'codecov', callback);
});

gulp.task('e2e-test', function(callback) {
  runSequence('dist', 'protractor', 'disconnect',
              callback);
});

gulp.task('test', ['unit-test', 'e2e-test']);
