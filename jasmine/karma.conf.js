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
      '../src/module.js',
      '../src/data.js',
      '../src/achievements.js',
      '../src/incremental_table_elements.js',
      'spec/*.js'
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: { '../src/incremental_table_elements.js': ['coverage'] },
    coverageReporter: {
      type: "lcov",
      dir: "coverage/"
    }
  });
};