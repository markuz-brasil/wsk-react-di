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
var thr = require('through2').obj
var source = require('vinyl-source-stream')
var browserify = require('browserify')

var CFG = require('./config');
var ROOT = CFG.root
var TMP = CFG.tmp
var APP = CFG.app
var CLIENT = CFG.client
var LIBS = CFG.libs
var DIST = CFG.dist
var SRC = '{'+ APP +',public}/**/*' // this is a hack
var ES5 = CFG.es5

// TODO: add comments
gulp.task('assets', function(next){
  runSequence(['assets:less', 'assets:jade', 'assets:js'], next)
})


// TODO: add comments
gulp.task('assets:js', function(next){
  runSequence(['assets:es6', 'assets:libs'], ['browserify', 'browserify:shims'], next)
})

// Compile and Automatically Prefix Stylesheets
gulp.task('assets:less', function () {
  return gulp.src([APP +'/index.{less,css}'])
    .pipe($.cached('less', {optimizeMemory: true}))
    // .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.autoprefixer(CFG.cssPrefixer))
    // .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(TMP, APP) ))
    .pipe($.size({title: 'less'}));
});

// TODO: add comments
gulp.task('assets:jade', function(){
  return gulp.src([SRC +'.jade'])
    .pipe($.cached('jade', {optimizeMemory: true}))
    .pipe($.sourcemaps.init())
    .pipe($.jade({pretty: true}))
    .on('error', CFG.throw)
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(TMP))
    .pipe($.size({title: 'jade'}))
});

gulp.task('assets:es6', function () {
  return gulp.src([SRC +'.js', SRC +'.jsx'])
    .pipe($.cached('assets:next', {optimizeMemory: true}))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.rename(function(path){path.extname = ".js"}))
    .pipe($['6to5']()).on('error', CFG.throw)
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(TMP))
    .pipe($.size({title: 'next'}))
})

// TODO: add comments
gulp.task('assets:libs', function(){
  return gulp.src([
      CLIENT +'/node_modules/{di/src,zone.js}/*.js',
    ])
    .pipe($.cached('assets:libs', {optimizeMemory: true}))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.rename(function(path){path.extname = ".js"}))
    .pipe($['6to5']()).on('error', CFG.throw)
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(TMP, LIBS)))
    .pipe($.size({title: 'libs'}))
});

