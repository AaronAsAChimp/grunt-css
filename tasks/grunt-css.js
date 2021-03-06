/*
 * grunt-css
 * https://github.com/jzaefferer/grunt-css
 *
 * Copyright (c) 2012 Jörn Zaefferer
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  grunt.registerMultiTask( "csslint", "Lint CSS files with csslint", function() {
    var csslint = require( "csslint" ).CSSLint;
    var files = grunt.file.expandFiles( this.file.src );
    var ruleset = {};
    csslint.getRules().forEach(function( rule ) {
      ruleset[ rule.id ] = 1;
    });
    for ( var rule in this.data.rules ) {
      if ( !this.data.rules[ rule ] ) {
        delete ruleset[rule];
      } else {
        ruleset[ rule ] = this.data.rules[ rule ];
      }
    }
    var hadErrors = 0;
    files.forEach(function( filepath ) {
      grunt.log.writeln( "Linting " + filepath );
      var result = csslint.verify( grunt.file.read( filepath ), ruleset );
      result.messages.forEach(function( message ) {
        grunt.log.writeln( "[".red + ( "L" + message.line ).yellow + ":".red + ( "C" + message.col ).yellow + "]".red );
        grunt.log[ message.type === "error" ? "error" : "writeln" ]( message.message + " " + message.rule.desc + " (" + message.rule.id + ")" );
      });
      if ( result.messages.length ) {
        hadErrors += 1;
      }
    });
    if (hadErrors) {
      return false;
    }
    grunt.log.writeln( "Lint free" );
  });

  grunt.registerMultiTask( "cssmin", "Minify CSS files with Sqwish.", function() {
    var max = grunt.helper( "concat", grunt.file.expandFiles( this.file.src ) );
    var min = require( "sqwish" ).minify( max, false );
    grunt.file.write( this.file.dest, min );
    grunt.log.writeln( "File '" + this.file.dest + "' created." );
    grunt.helper( "min_max_info", min, max );
  });

};
