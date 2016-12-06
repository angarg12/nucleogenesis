exports.config = {
  framework: 'jasmine',
  specs: [
    '../lib/jquery.min.js',
    'spec_helper.js',
    'spec/*.js'],
  multiCapabilities: [{
    browserName: 'chrome'
  }]
}