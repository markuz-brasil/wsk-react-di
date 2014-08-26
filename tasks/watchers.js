/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';
// var exec = require('child_process').execvar
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

// Watch Files For Changes & reload
var FILES = {
  html: path.join(APP, '**/*.{jade,html}'),
  css: path.join(APP, '**/*.{less,css}'),
  js: [
    path.join(APP, '**/*.{js,jsx}'),
    path.join(LIBS, '**/*.{js,jsx}')
  ],
  tasks: ['gulpfile.js', 'tasks/**/*.js'],
  test: [
    path.join('tests', '**/*.{js,jsx,coffee,less,css,jade,html}')
  ]
}

function runTasks () {
  var args = arguments
  return function (evt) {
    if ('changed' !== evt.type) { return }
    runSequence.apply(runSequence, args)
  }
}


function assets (TASKS) {
  log("Starting '"+ cyan('watch:assets') +"'...")

  if (TASKS.dev) {
    gulp.watch(FILES.html, runTasks('assets:jade', 'reload'))
    gulp.watch(FILES.css, runTasks('assets:less', 'reload'))
    gulp.watch(FILES.js, runTasks('assets:js', 'reload'))
  }

  if (TASKS.build) {
    gulp.watch(FILES.html, runTasks('assets:jade', 'assets:optimize', 'reload'))
    gulp.watch(FILES.css, runTasks('assets:less', 'assets:optimize', 'reload'))
    gulp.watch(FILES.js, runTasks('assets:js', 'assets:optimize', 'reload'))
  }
}


function gulpfile (TASKS) {
  log("Starting '"+ cyan('watch:gulpfile') +"'...")

  gulp.watch(FILES.tasks, runTasks('restart'))

}

function test (TASKS) {
  log("Starting '"+ cyan('watch:tests') +"'...")

  if (TASKS.dev) {
    gulp.watch(FILES.html, runTasks('assets:jade', 'assets:test', 'reload'))
    gulp.watch(FILES.css, runTasks('assets:less', 'assets:test', 'reload'))
    gulp.watch(FILES.js, runTasks('assets:js', 'assets:test', 'reload'))
    gulp.watch(FILES.test, runTasks('assets:test'))
  }

  if (TASKS.build) {
    gulp.watch(FILES.html, runTasks('assets:jade', 'assets:optimize', 'assets:test', 'reload'))
    gulp.watch(FILES.css, runTasks('assets:less', 'assets:optimize', 'assets:test', 'reload'))
    gulp.watch(FILES.js, runTasks('assets:js', 'assets:optimize', 'assets:test', 'reload'))
    gulp.watch(FILES.test, runTasks('assets:test'))
  }




  // console.log(gulp.watch)
}

module.exports = {
  test: test,
  assets: assets,
  gulpfile: gulpfile,
}


