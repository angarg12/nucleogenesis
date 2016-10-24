module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      '../js/jquery.min.js',
      '../js/angular.min.js',
      '../js/angular-animate.min.js',
      '../js/data.js',
      '../js/bootstrap.min.js',
      '../js/ziggurat.js',
      '../js/incremental_table_elements.js',
      '../js/angular-mocks.js',
      'spec/*.js'
    ],
    browsers: ['PhantomJS2'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: { '../js/incremental_table_elements.js': ['coverage'] ,
					'../js/data.js': ['coverage'] }
  });
};