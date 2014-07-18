/*
 * grunt-bloat
 * https://github.com/chrisgladd/grunt-bloat
 *
 * Copyright (c) 2013 Chris Gladd
 * Licensed under the MIT license.
 */

'use strict';

//Load Dependency
var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {
  var options = {};
  var files = [];
  var totalFiles = 0;
  var filesRead = 0;

  var used = {};
  var available = {};
  var done = null;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('bloat', 'Identify unused css classes', function(){
    options = this.options({
      "encoding": grunt.file.defaultEncoding
    });

    grunt.verbose.writeflags(options, 'Options');

    //Asynchonous onFinish function for grunt
    done = this.async();
    files = this.files;
    console.log(files);

    var sheets = grunt.file.expandMapping(options.stylesheets);
    var fileData = this.data;

    totalFiles = files[0].src.length + options.stylesheets.length;
    grunt.verbose.writeln("Total Files: " + totalFiles);

    /**
     * Search Files for all used classes
     */
    scanFilesForClasses(files, used);

    /**
     * Search CSS for all available classnames
     */
    scanFilesForClasses(sheets, available);
  });

  var scanFilesForClasses = function(files, store){
    files.forEach(function(filePair) {
      filePair.src.forEach(function(src){
        if(grunt.file.isDir(src)){ return; }

        var isJS = src.indexOf('.js') !== -1;
        var isHTML = src.indexOf('.html') !== -1;
        var isCSS = src.indexOf('.css') !== -1;

        grunt.verbose.writeln("Reading: " + src);

        //Standard Lib
        var array = fs.readFileSync(src).toString().split("\n");
        for(var i = 0; i < array.length; i++){
            if(isJS){
                searchJSFile(array[i], store);
            }else if(isHTML){
                searchHTMLFile(array[i], store);
            }else if(isCSS){
                searchCSSFile(array[i], store);
            }
        }
        filesRead++;
        if(filesRead === totalFiles){
            compareUsedAndAvail();
        }
      });
    });
  };

  var searchJSFile = function(line, classes){
      //Look for html classes in inline templates
      var foundClasses = /\sclass\=\"(.*)\"\s/g.exec(line);

      //Look for html classes in inline templates
      //var foundIds = /class\=\"(.*)\"/g.exec(line);
  };
  var splitHTMLClasses = function(classes){
      var split = classes.split(" ");
      return split.filter(function(d){
          return d.trim().length;
      }).map(function(d){
          return "."+d;
      });
  };
  var searchHTMLFile = function(line, classes){
      var found = [];

      //Look for in the template templates
      var foundClasses = /\sclass\=\"(.*)\"(?=\s|>)/g.exec(line);
      if(foundClasses && foundClasses.length > 1){
          found = found.concat(splitHTMLClasses(foundClasses[1]));
      }

      //Look for classes from data-ng-class 
      //var foundDataClasses = /ng-class\=\"(.*)\"\s/g.exec(line);
      //if(foundDataClasses && foundDataClasses.length > 1){
          //foundDataClasses = /\'(.*)\'/g.exec(foundDataClasses[1]);
          //if(foundDataClasses && foundDataClasses.length > 1){
              //found = found.concat(splitHTMLClasses(foundDataClasses[1]));
          //}
      //}

      found.map(function(name){
          classes[name] = classes[name] ? classes[name] + 1 : 1;
      });

      return classes;
  };

  /**
   * CSS Parsing
   */
  var splitCSSClasses = function(classes){
      var split = classes.split(" ");
      return split.map(function(d){
          d = d.replace(/&/g, '');
          d = d.replace(/:hover/g, '');
          d = d.replace(/:before/g, '');
          d = d.replace(/:after/g, '');
          return d;
      }).filter(function(d){
          if(d.trim() === ">"){ return false; }
          if(d.trim() === ","){ return false; }
          return d.trim().length;
      });
  };
  var searchCSSFile = function(line, classes){
      var found = [];

      var singleLine = /(.*){/g.exec(line);
      if(singleLine && singleLine.length > 1){
          found = found.concat(splitCSSClasses(singleLine[1]));
      }
      var multLine = /(.*),/g.exec(line);
      if(multLine && multLine.length > 1){
          found = found.concat(splitCSSClasses(multLine[1]));
      }

      found.map(function(name){
          classes[name] = classes[name] ? classes[name] + 1 : 1;
      });

      return classes;
  };

  var compareUsedAndAvail = function(){
      var availableCount = 0;
      var usedCount = 0;

      Object.keys(available).map(function(d){
          availableCount++;
          return d;
      });

      var unfound = [];
      Object.keys(used).map(function(d){
          if(available[d]){
              delete available[d];
          }else {
              unfound.push(d);
          }

          usedCount++;
          return d;
      });

      var out = [];
      Object.keys(available).map(function(d){
          out.push(d);
          return d;
      });

      grunt.log.writeln("Available Classes: " + availableCount);
      grunt.log.writeln("Used Classes: " + usedCount);
      grunt.log.writeln("Percentage Unused: " + ~~((availableCount - usedCount) * 100 / availableCount));

      var unused = out.join(grunt.util.linefeed);
      grunt.file.write(options.unused || "css/bloat.unused.css", unused);

      var ufOut = unfound.join(grunt.util.linefeed);
      grunt.file.write(options.unfound || "css/bloat.unfound.css", ufOut);

      //grunt.log.writeln("Un-used Classes: ");
      //grunt.log.write(unused);

      done();
  };

  var unixifyPath = function(filepath) {
      if(process.platform === 'win32'){
          return filepath.replace(/\\/g, '/');
      }else{
          return filepath;
      }
  };
};
