/*
 * grunt-bower-depend
 * https://github.com/chrisgladd/grunt-bower-depend
 *
 * Copyright (c) 2013 Chris Gladd
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp', 'bower_components'],
    },

    // Configuration to be run (and then tested).
    bower_depend: {
      default_options: {
        options: {  }
      },
      custom_options: {
        options: {
          copy: true
        },
        files: [{
          'expand': true,
          'cwd': 'bower_components/jquery/',
          'src': ['jquery.*js'],
          'dest': 'tmp/lib/'
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/default_test.js'],
      default_options: ['test/default_test.js'],
      custom_options: ['test/custom_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('defaultTest', ['clean', 
                                     'bower_depend:default_options', 
                                     'nodeunit:default_options']);

  grunt.registerTask('customTest', ['clean',
                                    'bower_depend:custom_options', 
                                    'nodeunit:custom_options']);

  // Whenever the "test" task is run, first clean the "tmp" dir,
  // then run this plugin's task(s), then test the result.
  grunt.registerTask('test', ['defaultTest','customTest']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
};
