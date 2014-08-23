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

var log = $.util.log;
var cyan = $.util.colors.cyan;


var CFG = require('./config');
var TMP = CFG.tmp
var APP = CFG.app
var WEB = CFG.web
var DIST = CFG.dist
var ROOT = CFG.root
var BUILD = CFG.build

// Watch Files For Changes & reload
var files = {
  html: path.join(APP, '**/*.{jade,html}'),
  css: path.join(APP, '**/*.{less,css}'),
  js: [
    path.join(APP, '**/*.js'),
    path.join('libs', '**/*.js')
  ],
}

// files.all = [ files.html, files.css, files.js ]

function assets (reload) {
  log("Starting '"+ cyan('watch:assets') +"'...")

  gulp.watch(files.html, ['assets:jade', reload]);
  gulp.watch(files.css, ['assets:less', reload]);
  gulp.watch(files.js, ['assets:js', reload]);
}

module.exports = {
  assets: assets,
}

