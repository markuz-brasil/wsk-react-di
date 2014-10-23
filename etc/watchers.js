'use strict'

var path = require('path')

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var log = $.util.log
var red = $.util.colors.red
var cyan = $.util.colors.cyan

var CFG = require('./config');
var TMP = CFG.tmp
var SRC = CFG.src

var TASKS = CFG.tasks

// Watch Files For Changes & reload
var FILES = {
  html: [ SRC +'/**/*.{jade,html}', ],
  // js: [
  //   SRC +'/{index,src/**/*,!vendors}.{js,jsx}',
  // ],
  bundle: [
    SRC +'/{index,src/**/*}.{js,jsx}',
  ],
  vendors: [
    SRC +'/vendors/*.{js,jsx}',
  ],
  tasks: [ 'gulpfile.js', 'etc/**/*.js', ],
}

function runTasks () {
  var args = [].slice.call(arguments)

  return function (evt) {
    if ('changed' !== evt.type) { return }
    // bug on runSequece.
    // this JSON trick is cleanest way to deep copy a JSON.
    runSequence.apply(runSequence, JSON.parse(JSON.stringify(args)))
  }
}

function assets (TASKS) {
  log("Starting '"+ cyan('watch:assets') +"'...")

  gulp.watch(FILES.bundle, runTasks('assets:es6', 'assets:bundle', 'reload'))
  gulp.watch(FILES.vendors, runTasks('assets:es6', 'assets:vendors', 'reload'))
  gulp.watch(FILES.html, runTasks('assets:jade', 'reload'))
}

function gulpfile (TASKS) {
  log("Starting '"+ cyan('watch:gulpfile') +"'...")
  gulp.watch(FILES.tasks, runTasks('restart'))
}

module.exports = {
  assets: assets,
  gulpfile: gulpfile,
}


