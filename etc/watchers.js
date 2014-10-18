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
var APP = CFG.app
var LIBS = CFG.libs

var TASKS = CFG.tasks

// Watch Files For Changes & reload
var FILES = {
  html: path.join(APP, '**/*.{jade,html}'),
  css: path.join(APP, '**/*.{less,css}'),
  js: [
    path.join(APP, '**/*.{js,jsx}'),
    path.join(LIBS, '**/*.{js,jsx}')
  ],
  tasks: ['gulpfile.js', 'etc/**/*.js'],
  test: [
    path.join('tests', '**/*.{js,jsx,coffee,less,css,jade,html}')
  ]
}


function runTasks () {
  var args = Array.prototype.slice.call(arguments)

  return function (evt) {
    if ('changed' !== evt.type) { return }
    // bug on runSequece.
    // this JSON trick is cleanest way to deep copy an obj.
    runSequence.apply(runSequence, JSON.parse(JSON.stringify(args)))
  }
}


function assets (TASKS) {
  log("Starting '"+ cyan('watch:assets') +"'...")

  if (TASKS.build) {
    gulp.watch(FILES.html, runTasks('assets:jade', 'optimize', 'reload'))
    gulp.watch(FILES.css, runTasks('assets:less', 'optimize', 'reload'))
    gulp.watch(FILES.js, runTasks('assets:js', 'optimize', 'reload'))
  }
  else {
    gulp.watch(FILES.html, runTasks('assets:jade', 'reload'))
    gulp.watch(FILES.css, runTasks('assets:less', 'reload'))
    gulp.watch(FILES.js, runTasks('assets:js', 'reload'))
  }

}

function gulpfile (TASKS) {
  log("Starting '"+ cyan('watch:gulpfile') +"'...")

  gulp.watch(FILES.tasks, runTasks('restart'))

}

function test (TASKS) {
  log("Starting '"+ cyan('watch:tests') +"'...")

  if (TASKS.build) {
    gulp.watch(FILES.html, runTasks('assets:jade', 'optimize', ['assets:test', 'reload']))
    gulp.watch(FILES.css, runTasks('assets:less', 'optimize', ['assets:test', 'reload']))
    gulp.watch(FILES.js, runTasks('assets:js', 'optimize', ['assets:test', 'reload']))
    gulp.watch(FILES.test, runTasks('assets:test'))
  }
  else {
    gulp.watch(FILES.html, runTasks('assets:jade', ['assets:test', 'reload']))
    gulp.watch(FILES.css, runTasks('assets:less', ['assets:test', 'reload']))
    gulp.watch(FILES.js, runTasks('assets:js', ['assets:test', 'reload']))
    gulp.watch(FILES.test, runTasks('assets:test'))
  }

}

module.exports = {
  test: test,
  assets: assets,
  gulpfile: gulpfile,
}


