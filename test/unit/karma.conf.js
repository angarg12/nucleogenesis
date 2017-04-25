module.exports = function(config) {
  config.set({
    basePath: '../../',
    frameworks: ['jasmine-jquery', 'jasmine'],
    files: [
      'build/lib/jquery.min.js',
      'build/lib/angular.min.js',
      'build/lib/angular-ui-router.min.js',
      'build/lib/angular-animate.min.js',
      'build/lib/bootstrap.min.js',
      'build/lib/ziggurat.js',
      'build/lib/angular-mocks.js',
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
