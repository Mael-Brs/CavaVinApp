'use strict';
// gulp
var gulp = require('gulp');
var path = require('path');
var paths = gulp.paths;
var options = gulp.options;
// plugins
var $ = require('gulp-load-plugins')();
// modules
var Server = require('karma').Server;
var bs = require('browser-sync');

// KARMA
function runKarma (singleRun, done) {
  var confFile = options.conf ? options.conf : 'karma.conf.js';
  new Server({
    configFile: path.join(__dirname, '/../' + confFile),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, done).start();
}

gulp.task('karma', ['linting'], function (done) {
  runKarma(true, done);
});

gulp.task('karma:auto', ['linting'], function (done) {
  runKarma(false, done);
});

// PROTRACTOR
// Downloads the selenium webdriver
//gulp.task('webdriver-update', $.protractor.webdriver_update);
//gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor (done) {
  gulp.src(paths.protractor)
    .pipe($.protractor.protractor({
      configFile: options.conf ? options.conf : 'protractor.conf.js'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      bs.exit();
      done();
    });
}

gulp.task('protractor', ['serve', 'linting'], function (done) {
  runProtractor(done);
});

var protractorBuildDeps = ['serve-build'];
if (options.build !== false) {
  protractorBuildDeps.push('build');
}
gulp.task('protractor-build', protractorBuildDeps, function (done) {
  gulp.start('linting');

  runProtractor(done);
});
