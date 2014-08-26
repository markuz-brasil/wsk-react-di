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

var CFG = require('./config');
var ROOT = CFG.root
var TMP = CFG.tmp
var APP = CFG.app
var LIBS = CFG.libs
var SRC = '{'+ APP +','+ LIBS +'}/**/*'

// TODO: add comments
gulp.task('assets', function(next){
  runSequence([
    'assets:less', 'assets:jade', 'assets:js'], next)
})

// TODO: add comments
gulp.task('assets:js', function(next){
  runSequence([
    'assets:es7', 'assets:react'], 'assets:webpack', next)
})

// Compile and Automatically Prefix Stylesheets
gulp.task('assets:less', function () {
  return gulp.src([SRC +'.{less,css}'])
    .pipe($.cached('less', {optimizeMemory: true}))
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.autoprefixer(CFG.cssPrefixer))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(TMP))
    .pipe($.size({title: 'less'}));
});

// TODO: add comments
gulp.task('assets:jade', function(){
  return gulp.src([SRC +'.jade'])
    .pipe($.cached('jade', {optimizeMemory: true}))
    .pipe($.sourcemaps.init())
    .pipe($.jade({pretty: true}))
    .on('error', console.error.bind(console))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(TMP))
    .pipe($.size({title: 'jade'}))
});

// TODO: add comments
gulp.task('assets:es7', function(next){
  return gulp.src([SRC +'.js'])
    .pipe($.cached('es7', {optimizeMemory: true}))
    .pipe($.sourcemaps.init())
    .pipe($.traceur(CFG.traceur()))
    .on('error', console.error.bind(console))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(TMP))
    .pipe($.size({title: 'es7'}))
});

// TODO: add comments
gulp.task('assets:react', function(next){
  return gulp.src([SRC +'.jsx'])
    .pipe($.cached('react', {optimizeMemory: true}))
    .pipe($.react({harmony: true, sourceMap: true}))
    .pipe($.sourcemaps.init())
    .pipe($.traceur(CFG.traceur()))
    .on('error', console.error.bind(console))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(TMP))
    .pipe($.size({title: 'react'}))
});

// TODO: add comments
gulp.task('assets:webpack', function(next){
  var pack = true;
  return gulp.src([
      TMP +'/**/*.js',
      '!'+ TMP +'/{webpack,build,dist}/**',
    ])
    .pipe($.cached('webpack', {optimizeMemory: true}))
    .pipe(thr(function(f,e,next){
      // TODO: explain why all of this.
      var ctx = this;
      if (!pack) return next()
      pack = false

      $.webpack(CFG.webpack())
        .on('error', console.error.bind(console))
        .on('end', next)
        .pipe(thr(function(vfs, e, next){
          ctx.push(vfs); next()
        }))
    }))
    .pipe($.rename(function(filePath){
      filePath.dirname = TMP +'/webpack';
      if (filePath.extname === '.map') {
        filePath.dirname += '/maps'
      }
    }))
    .pipe(gulp.dest('.'))
    .pipe($.size({title: 'webpack'}))
});

gulp.task('assets:optimize', function(next){
  // mock
  setTimeout(next, 1000)
});

gulp.task('assets:test', function(next){
  var cmd = './node_modules/.bin/mocha-casperjs tests/index.coffee'

  cmd = exec(cmd, {cwd: ROOT});
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', function(err){ next() })
});




// // TODO: write the equivalent for es7

// // Lint JavaScript
// gulp.task('jshint', function () {
//   return gulp.src('app/scripts/**/*.js')
//     .pipe(reload({stream: true, once: true}))
//     .pipe($.jshint())
//     .pipe($.jshint.reporter('jshint-stylish'))
//     .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
// });

// // Optimize Images
// gulp.task('images', function () {
//   return gulp.src('app/images/**/*')
//     .pipe($.cache($.imagemin({
//       progressive: true,
//       interlaced: true
//     })))
//     .pipe(gulp.dest('dist/images'))
//     .pipe($.size({title: 'images'}));
// });

// // Copy Web Fonts To Dist
// gulp.task('fonts', function () {
//   return gulp.src(['app/fonts/**'])
//     .pipe(gulp.dest('dist/fonts'))
//     .pipe($.size({title: 'fonts'}));
// });
