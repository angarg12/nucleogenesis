module.exports = function(grunt) {

  grunt.initConfig({
    karma: {  
      unit: {
        configFile: 'jasmine/karma.conf.js'
      }
    },
    protractor: {
      e2e: {
        options: {
          configFile: "protractor/protractor.conf.js",
          keepAlive: true,
          noColor: false,
          webdriverManagerUpdate: true,
          args: { }
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          hostname: 'localhost',
          base: ['.']
        }
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
  
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-contrib-connect');  
  grunt.loadNpmTasks('grunt-karma-coveralls');
  grunt.loadNpmTasks('grunt-karma'); 
  
  grunt.registerTask('e2e-test', ['connect', 'protractor']);
  grunt.registerTask('unit-test', ['karma','coveralls']);
  grunt.registerTask('test', ['unit-test','e2e-test']);
};