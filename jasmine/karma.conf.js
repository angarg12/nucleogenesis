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
      '../src/services/*.js',
      '../src/controllers/main.js',
      'common.js',
      'spec/*.js'
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: { 
      '../src/controllers/*.js': ['coverage'] ,
      '../src/services/*.js': ['coverage'],
      '../src/data.js': ['coverage']
    },    
    coverageReporter: {
      type: "lcov",
      dir: "coverage/"
    }
  });
};