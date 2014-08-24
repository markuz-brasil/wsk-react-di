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
var exec = require('child_process').exec

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');

var log = $.util.log
var red = $.util.colors.red
var cyan = $.util.colors.cyan

var CFG = require('./tasks/config');
var TMP = CFG.tmp
var APP = CFG.app
var WEB = CFG.web
var DIST = CFG.dist
var ROOT = CFG.root
var BUILD = CFG.build

// Clean Output Directory
gulp.task('clean', del.bind(null, [TMP, DIST]));

if (process.argv[2] && process.argv[2].split(':')[0] === 'serve') {
  log("Starting '"+ cyan('watch:tasks') +"'...")
  gulp.watch(['gulpfile.js', 'tasks/**/*.js', 'webpack.config.js'], function(evt){
    if ('changed' === evt.type) {
      log(red(':: restarting ::'))
      process.exit(0)
    }
  })
}

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {
  console.log(err)
}

// TODO: add comments
gulp.task('default', ['clean'], function(cb){
  runSequence('assets', cb)
})



