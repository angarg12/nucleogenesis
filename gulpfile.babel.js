/* eslint-env node */
/* jslint node: true */
/* jslint esversion: 6 */
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import uglifyes from 'uglify-es';
import composer from 'gulp-uglify/composer';
import bowerCli from 'bower';

// Include plugins
let plugins = require('gulp-load-plugins')();

let Server = require('karma').Server;
let ugly = composer(uglifyes, console);

// unit test
const karma = (done) => {
  new Server({
    configFile: __dirname + '/test/unit/karma.conf.js',
    singleRun: true
  }, done).start();
};

const codecov = () => {
return new Promise((resolve) => {
  gulp
    .src(['test/unit/coverage/**/lcov.info'], { read: false })
    .pipe(plugins.codeclimateReporter({ token: '8e959350aa2fde657bbdd472964d5b2bdbb7d2ba10b8f6137865f2c241ecc86e' }))
    .on('end', resolve);
  });
};

// e2e test
const connect = () => {
  return plugins.connect.server({
    root: 'build/',
    port: 9000
  });
};

const webdriver_update = () => {
  plugins.protractor.webdriver_update_specific({
	browsers: ['ignore_ssl']
})};

const protractor_server = () => {
  return gulp.src(['test/integration/spec/**.js'], { read: false })
    .pipe(plugins.protractor.protractor({
        configFile: 'test/integration/protractor.conf.js'
    }))
    .on('error', function(e) { throw e; });
  };

const disconnect = () => {
  return plugins.connect.serverClose();
};

const protractor = gulp.series(connect, webdriver_update, protractor_server);

// clean
const clean = () => {
  return del(['dist','build']);
};

// dist
const htmlmin = () => {
  return gulp.src('build/**/*.html')
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
};

const uglify = () => {
  return gulp.src('build/scripts/app.min.js')
    .pipe(ugly())
    .pipe(gulp.dest('dist/scripts'));
};

const clean_css = () => {
  return gulp.src('build/**/*.css')
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest('dist/'));
};

const minify = gulp.series(uglify, htmlmin, clean_css);

// FIXME can we do this with a parametric task?
const copy_lib_dist = () => {
  return gulp.src('bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
};

// dependencies
const bower = () => {
  //return plugins.bower();
  return new Promise((resolve) => {
    bowerCli.commands.install(undefined, undefined, {}).on('end', resolve);
  });
};

// copy
const copy_js = () => {
  return gulp.src('src/scripts/**')
    .pipe(gulp.dest('build/scripts'));
};

const copy_data = () => {
  return gulp.src('src/data/**')
    .pipe(gulp.dest('build/data'));
};

const copy_lang = () => {
  return gulp.src('src/lang/**')
    .pipe(gulp.dest('build/lang'));
};

const copy_html = () => {
  return gulp.src('src/html/**')
    .pipe(gulp.dest('build/'));
};

const copy_css = () => {
  return gulp.src('src/styles/**')
    .pipe(gulp.dest('build/styles'));
};

const copy_lib = () => {
  return gulp.src('bower_components/**')
    .pipe(gulp.dest('build/bower_components'));
};

const copy_build = gulp.series(
  copy_js,
  copy_data,
  copy_lang,
  copy_html,
  copy_css,
  copy_lib
);

// build
const check_reachable_molecules = () => {
  return plugins.run('node build_scripts/check_reachable_molecules.js',{verbosity: 3}).exec();
};

const populate_player = () => {
  return plugins.run('node build_scripts/populate_player.js',{silent:true}).exec();
};

const populate_data = () => {
  return plugins.run('node build_scripts/populate_data.js',{silent:true}).exec();
};

const generate_isotopes = () => {
  return plugins.run('node build_scripts/generate_isotopes.js',{silent:true}).exec();
};

const generate_resource_matrix = () => {
  return plugins.run('node build_scripts/generate_resource_matrix.js',{silent:true}).exec();
};

const generate_decay = () => {
  return plugins.run('node build_scripts/generate_decay.js',{silent:true}).exec();
};

const generate_ions = () => {
  return plugins.run('node build_scripts/generate_ions.js',{silent:true}).exec();
};

const generate_reactions = () => {
  return plugins.run('node build_scripts/generate_reactions.js',{silent:true}).exec();
};

const generate_antimatter = () => {
  return plugins.run('node build_scripts/generate_antimatter.js',{silent:true}).exec();
};

const generate_achievements = () => {
  return plugins.run('node build_scripts/generate_achievements.js',{silent:true}).exec();
};

const generate_unlocks = () => {
  return plugins.run('node build_scripts/generate_unlocks.js',{silent:true}).exec();
};

const generate_achievement_functions = () => {
  return plugins.run('node build_scripts/generate_achievement_functions.js',{silent:false}).exec();
};

const generate_upgrades = () => {
  return plugins.run('node build_scripts/generate_upgrades.js',{silent:false}).exec();
};

const generate_exotic_upgrades = () => {
  return plugins.run('node build_scripts/generate_exotic_upgrades.js',{silent:false}).exec();
};

const generate_upgrade_functions = () => {
  return plugins.run('node build_scripts/generate_upgrade_functions.js',{silent:true}).exec();
};

const generate_element_slot = () => {
  return plugins.run('node build_scripts/generate_element_slot.js',{silent:true}).exec();
};

const check_isotopes = () => {
  return plugins.run('node build_scripts/check_isotopes.js',{silent:false}).exec();
};

const sort_resources = () => {
  return plugins.run('node build_scripts/sort_resources.js',{silent:true}).exec();
};

const process_lang = () => {
  return plugins.run('node build_scripts/process_lang.js',{silent:true}).exec();
};

const concat = () => {
  return gulp.src(['build/scripts/modules/module.js',
    'build/scripts/**/*!(module.js)'])
    .pipe(plugins.concat('app.min.js'))
    .pipe(gulp.dest('build/scripts'));
};

// public tasks
const build = gulp.series(
  clean,
  bower,
  copy_build,
  check_reachable_molecules,
  generate_isotopes,
  generate_resource_matrix,
  generate_ions,
  generate_decay,
  generate_reactions,
  generate_antimatter,
  generate_achievements,
  generate_unlocks,
  generate_exotic_upgrades,
  generate_upgrades,
  generate_achievement_functions,
  generate_upgrade_functions,
  generate_element_slot,
  process_lang,
  sort_resources,
  check_isotopes,
  populate_player,
  populate_data,
  concat);

const build_unit_test = gulp.series(build, karma);
const dist = gulp.series(build, minify, copy_lib_dist);
const unit_test = gulp.series(dist, karma, codecov);
const e2e_test = gulp.series(dist, protractor, disconnect);
const test = gulp.series(unit_test, e2e_test);

export {
  build,
  build_unit_test,
  dist,
  unit_test,
  e2e_test,
  test
}
