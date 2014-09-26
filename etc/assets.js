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
var LIBS = CFG.libs
var DIST = CFG.dist
var SRC = '{'+ APP +','+ LIBS +'}/**/*'
var ES5 = CFG.es5

// TODO: add comments
gulp.task('assets', function(next){
  runSequence(['assets:less', 'assets:jade', 'assets:js'], next)
})

// TODO: add comments
gulp.task('assets:js', function(next){
  runSequence(['assets:esx', 'assets:react', 'assets:copy-js', 'assets:libs'], 'assets:es5', 'browserify', next)
})

// Compile and Automatically Prefix Stylesheets
gulp.task('assets:less', function () {
  return gulp.src([APP +'/index.{less,css}'])
    .pipe($.cached('less', {optimizeMemory: true}))
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.autoprefixer(CFG.cssPrefixer))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest( path.join(TMP, APP) ))
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

// TODO: add comments
gulp.task('assets:esx', function(next){
  return gulp.src([SRC +'.js'])
    .pipe($.cached('assets:esx', {optimizeMemory: true}))
    .pipe($.sourcemaps.init({loadMaps: true}))

    .pipe($.traceur(CFG.traceur()))
    .on('error', CFG.throw)
    .pipe(thr(function(vfs,e,n){
      vfs.path = vfs.path.replace('.js', '.es6.js')
      vfs.path = vfs.path.replace('.esx', '')
      n(null, vfs)
    }))

    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(TMP))
    .pipe($.size({title: 'esx'}))
});

gulp.task('assets:copy-js', function(next){
  return gulp.src([
      ROOT +'/node_modules/gulp-regenerator/node_modules/regenerator/runtime/dev.js'
    ])
    .pipe($.cached('assets:copy-js', {optimizeMemory: true}))
    .pipe(thr(function(vfs,e,n){
      vfs.path = vfs.base + 'regenerator/index.js'
      n(null, vfs)
    }))

    .pipe(gulp.dest(path.join(TMP, ES5, LIBS)))
    .pipe($.size({title: 'js'}))
});

// TODO: add comments
gulp.task('assets:libs', function(next){
  return gulp.src([
      'client' +'/node_modules/{di/src,zone.js}/*.js',
    ])
    .pipe($.cached('assets:libs', {optimizeMemory: true}))

    .pipe($.regenerator())
    .on('error', CFG.throw)

    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.traceur({sourceMaps: true}))
    .on('error', CFG.throw)

    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(TMP, ES5, LIBS)))
    .pipe($.size({title: 'libs'}))
});

// TODO: add comments
gulp.task('assets:es5', function(next){
  return gulp.src([
      SRC +'.es6.js',
      TMP +'/**/*.es6.js',
    ])
    .pipe($.cached('assets:es5', {optimizeMemory: true}))

    .pipe($.regenerator())
    .on('error', CFG.throw)

    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.traceur({sourceMaps: true}))
    .on('error', CFG.throw)
    .pipe(thr(function(vfs,e,n){
      vfs.path = vfs.path.replace('.es6.js', '.js')
      n(null, vfs)
    }))

    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(TMP, ES5)))
    .pipe($.size({title: 'es5'}))
});

// TODO: add comments
gulp.task('assets:react', function(next){
  return gulp.src([SRC +'.jsx'])
    .pipe($.cached('assets:react', {optimizeMemory: true}))
    .pipe($.sourcemaps.init({loadMaps: true}))

    .pipe($.react({sourceMap: true}))
    .on('error', CFG.throw)
    .pipe(thr(function(vfs,e,n){
      vfs.path = vfs.path.replace('.js', '.es6.js')
      n(null, vfs)
    }))

    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(TMP))
    .pipe($.size({title: 'react'}))
});

// TODO: add comments
gulp.task('assets:test', function(next){
  var cmd = './node_modules/.bin/mocha-casperjs tests/index.coffee'

  cmd = exec(cmd, {cwd: ROOT});
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', function(err){
    if (err) { console.log('test exit code:', err)}
    next()
  })
});

