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
var files = {
  html: path.join(APP, '**/*.{jade,html}'),
  css: path.join(APP, '**/*.{less,css}'),
  js: [
    path.join(APP, '**/*.{js,jsx}'),
    path.join(LIBS, '**/*.{js,jsx}')
  ],
  test: [
    path.join('tests', '**/*.{js,jsx,coffee,less,css,jade,html}')
  ]
}

function assets (reload) {
  log("Starting '"+ cyan('watch:assets') +"'...")

  gulp.watch(files.html, ['assets:jade', reload]);
  gulp.watch(files.css, ['assets:less', reload]);
  gulp.watch(files.js, ['assets:js', reload]);
}

function gulpfile () {
  log("Starting '"+ cyan('watch:tasks') +"'...")
  gulp.watch(['gulpfile.js', 'tasks/**/*.js'], function(evt){
    if ('changed' === evt.type) {
      log(red(':: restarting ::'))
      process.exit(0)
    }
  })
}

function test (reload) {
  log("Starting '"+ cyan('watch:tests') +"'...")

  gulp.watch(files.html, function(evt){
    if ('changed' !== evt.type) { return }
    runSequence('assets:jade', 'test')
  })

  gulp.watch(files.css, function(evt){
    if ('changed' !== evt.type) { return }
    runSequence('assets:less','test')
  })

  gulp.watch(files.js, function(evt){
    if ('changed' !== evt.type) { return }
    runSequence('assets:js', 'test')
  })

  gulp.watch(files.test, function(evt){
    if ('changed' !== evt.type) { return }
    gulp.start('test')
  })


}

module.exports = {
  assets: assets,
  gulpfile: gulpfile,
  test: test,
}

