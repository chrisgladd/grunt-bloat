'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.custom_options = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  custom_options: function(test) {
    test.expect(3);

    test.equal(grunt.file.exists("bower_components/jquery/jquery.js"), true, 'should have installed jquery');

    test.equal(grunt.file.exists("tmp/lib/jquery.js"), true, 'should have copied the targeted library');

    test.equal(grunt.file.exists("tmp/lib/jquery.min.js"), true, 'should have copied the targeted library');
 
    test.done();
  }
};
