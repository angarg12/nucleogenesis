'use strict';

module.exports = function(config) {
  config.set({
    basePath: '../../',
    frameworks: ['jasmine-jquery', 'jasmine'],
    files: [
      'build/bower_components/angular/angular.min.js',
      'build/bower_components/angular-animate/angular-animate.min.js',
      'build/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'build/bower_components/angular-sanitize/angular-sanitize.min.js',
      'build/bower_components/bootstrap/dist/js/bootstrap.min.js',
      'build/bower_components/angularjs-slider/dist/rzslider.min.js',
      'build/bower_components/ziggurat/ziggurat.js',
      'build/bower_components/swarm-numberformat/dist/swarm-numberformat.js',
      'build/bower_components/angular-translate/angular-translate.js',
      'build/bower_components/angular-mocks/angular-mocks.js',
      'build/scripts/app.min.js',
      'test/unit/common.js',
      'test/unit/spec/*.js'
    ],
    browsers: ['Chrome', 'Firefox'],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'build/scripts/**/*.js': ['coverage']
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'test/unit/coverage/'
    }
  });
};
