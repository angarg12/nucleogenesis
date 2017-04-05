module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine-jquery', 'jasmine'],
    files: [
      'lib/jquery.min.js',
      'lib/angular.min.js',
      'lib/angular-ui-router.min.js',
      'lib/angular-animate.min.js',
      'lib/bootstrap.min.js',
      'lib/ziggurat.js',
      'lib/angular-mocks.js',
      'src/modules/module.js',
      'src/services/*.js',
      'src/controllers/main-loop.js',
      'jasmine/common.js',
      'jasmine/spec/*.js',
      {pattern: 'src/data/*.json', watched: true, served: true, included: false}
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/controllers/*.js': ['coverage'] ,
      'src/services/*.js': ['coverage']
    },
    coverageReporter: {
      type: "lcov",
      dir: "jasmine/coverage/"
    }
  });
};
