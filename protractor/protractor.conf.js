exports.config = {
  framework: 'jasmine',
  specs: [
    '/lib/jquery.min.js',
    '/protractor/helper/*.js',
    '/protractor/spec/*.js'],
  multiCapabilities: [{
    browserName: 'chrome'
  }]
}
