exports.config = {
  framework: 'jasmine',
  specs: [
    '/build/bower_components/jquery/dist/jquery.min.js',
    '/test/integration/helper/*.js',
    '/test/integration/spec/*.js'],
  multiCapabilities: [{
    browserName: 'chrome'
  }]
}
