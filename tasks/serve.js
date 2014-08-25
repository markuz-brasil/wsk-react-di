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
var path = require('path')
var exec = require('child_process').exec

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var watch = require('./watch');
var CFG = require('./config');
var TMP = CFG.tmp
var APP = CFG.app

// Watch Files For Changes & Reload
gulp.task('serve', function (cb) {
  var opts = CFG.browserSync
  opts.browser = 'skip'
  opts.server.baseDir = [
    path.join(TMP, APP, 'wsk-app'),
    path.join(TMP, APP),
    path.join(TMP, 'webpack'),
    TMP,
    path.join(APP, 'wsk-app'),
    APP,
    'bower_components'
  ]

  watch.assets(reload)
  browserSync(opts, function(err){
    if (err) throw err
    cb()
    runSequence('assets', reload)
  });
});

// Watch Files For Changes & Reload
gulp.task('serve:test', function (cb) {
  var opts = CFG.browserSync
  opts.browser = 'skip'
  opts.server.baseDir = [
    path.join(TMP, APP, 'wsk-app'),
    path.join(TMP, APP),
    path.join(TMP, 'webpack'),
    TMP,
    path.join(APP, 'wsk-app'),
    APP,
    'bower_components'
  ]

  watch.test(reload)
  browserSync(opts, function(err){
    if (err) throw err
    cb()
    runSequence('assets', function(){
      reload()
      // watch.test(reload)
      gulp.start('test')
    })
  });
});

// // Build and serve the output from the dist build
// gulp.task('serve:build', ['assets:react'], function () {
//   var opts = OPTS
//   opts.port = 3001
//   opts.server.baseDir = path.join(TMP, 'build/')
//   watch.build(reload)
//   browserSync(opts);
// });
