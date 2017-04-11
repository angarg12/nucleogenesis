exports.config = {
  framework: 'jasmine',
  specs: [
    '/build/lib/jquery.min.js',
    '/protractor/helper/*.js',
    '/protractor/spec/*.js'],
  multiCapabilities: [{
    browserName: 'chrome'
  }]
}
