exports.config = {
  framework: 'jasmine',
  specs: [
    '/build/lib/jquery.min.js',
    '/test/integration/helper/*.js',
    '/test/integration/spec/*.js'],
  multiCapabilities: [{
    browserName: 'chrome'
  }]
}
