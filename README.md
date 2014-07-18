# THIS PROJECT IS UNDER HEAVY DEVELOPMENT AND NOT READY FOR PUBLIC USE, USE AT YOUR OWN RISK

# grunt-bloat

> Indentify un-used classes in CSS from JS and HTML

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bloat --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bloat');
```

## The "bloat" task

### Overview
In your project's Gruntfile, add a section named `bloat` to the data object passed into `grunt.initConfig()`.

```js
bloat: {
  options: {
    stylesheets: ["app.min.css"],
    ignored: [],
  },
  your_target: {
    // Target-specific file lists and/or options go here.
    files: [{
      'unused.css': [
          "index.html",
          "partial/**/*.html",
          "js/**/*.js"
      ]
    }]
  },
}
```

### Options

#### options.styleshets
Type: `Array`
Default value: `[]`

An array of stylesheets to check for unused classes

### Usage Examples

#### Stylesheets
In this example, the default `bower install` command is executed, then since the `copy` option is `true` the specified files are copied from the new bower_components into the lib folder.

```js
bloat: {
  options: {
    stylesheets: ["app.min.css"],
    ignored: [],
  },
  your_target: {
    // Target-specific file lists and/or options go here.
    files: [{
      'unused.css': [
          "index.html",
          "partial/**/*.html",
          "js/**/*.js"
      ]
    }]
  },
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2014-07-17   v0.1.0   Initial Release
