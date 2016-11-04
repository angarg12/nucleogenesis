module.exports = function(grunt) {

  grunt.initConfig({
    karma: {  
      unit: {
        configFile: 'jasmine/karma.conf.js'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'js/incremental_table_elements.js', 'js/data.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-karma'); 
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('test', ['jshint','karma']);
};