module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      '../lib/jquery.min.js',
      '../lib/angular.min.js',
      '../lib/angular-animate.min.js',
      '../lib/bootstrap.min.js',
      '../lib/ziggurat.js',
      '../lib/angular-mocks.js',
      '../src/modules/module.js',
      '../src/data.js',
      '../src/services/achievement.js',
      '../src/services/util.js',
      '../src/controllers/main.js',
      'spec/*.js'
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: { '../src/controllers/main.js': ['coverage'] },
    coverageReporter: {
      type: "lcov",
      dir: "coverage/"
    }
  });
};