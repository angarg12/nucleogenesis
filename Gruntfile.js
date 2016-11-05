module.exports = function(grunt) {

  grunt.initConfig({
    karma: {  
      unit: {
        configFile: 'jasmine/karma.conf.js'
      }
    },
    coveralls: {
      options: {
          debug: true,
          coverageDir: 'jasmine/coverage',
          dryRun: false,
          force: true,
          recursive: true
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-karma-coveralls');
  grunt.loadNpmTasks('grunt-karma'); 
  grunt.registerTask('test', ['karma','coveralls']);
};