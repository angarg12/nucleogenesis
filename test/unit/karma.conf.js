module.exports = function(config) {
  config.set({
    basePath: '../../',
    frameworks: ['jasmine-jquery', 'jasmine'],
    files: [
      'build/bower_components/angular/angular.min.js',
      'build/bower_components/angular-animate/angular-animate.min.js',
      'build/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'build/bower_components/angular-animate/angular-animate.min.js',
      'build/bower_components/bootstrap/dist/js/bootstrap.min.js',
      'build/bower_components/ziggurat/ziggurat.js',
      'build/bower_components/angular-mocks/angular-mocks.js',
      'build/scripts/modules/module.js',
      'build/scripts/services/*.js',
      'build/scripts/controllers/main-loop.js',
      'test/unit/common.js',
      'test/unit/spec/*.js',
      {pattern: 'build/data/*.json', watched: true, served: true, included: false}
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'build/scripts/**/*.js': ['coverage']
    },
    coverageReporter: {
      type: "lcov",
      dir: "test/unit/coverage/"
    }
  });
};
