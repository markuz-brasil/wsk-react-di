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
var fs = require('fs')

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var thr = require('through2').obj
var source = require('vinyl-source-stream')
var browserify = require('browserify')
var factor = require('factor-bundle')

var CFG = require('./config');
var ROOT = CFG.root
var TMP = CFG.tmp
var APP = CFG.app
var LIBS = CFG.libs
var DIST = CFG.dist
var ES5 = CFG.es5
var SRC = '{'+ APP +','+ LIBS +'}/**/*'

var browserifyConfig = {
  entries: [
    path.join(ROOT, TMP, ES5, APP),
    path.join(ROOT, TMP, ES5, APP, 'kitchen'),
    path.join(ROOT, TMP, ES5, APP, 'public/zone-extras'),
  ],
  debug: true,
};

var aliasify = require('aliasify').configure({
  aliases: {
    di: './'+ path.join(TMP, ES5, LIBS, 'di/src'),
    zone: './'+ path.join(TMP, ES5, LIBS, 'zone.js'),
  }
})

// TODO: add comments
gulp.task('browserify', function(next){
  // need to create bundles dir before browserify needs
  try {
    fs.mkdirSync(path.join(ROOT, DIST))
    fs.mkdirSync(path.join(ROOT, DIST, '/bundles'))
  }
  catch (err) {
    // ignoring if file already exists :)
    if (err.errno !== 47) {
      throw err
    }
  }

  return browserify(browserifyConfig)
    .plugin(factor, {
      o: [
        './'+ path.join(DIST, '/bundles', 'app.js'),
        './'+ path.join(DIST, '/bundles', 'kitchen.js'),
        './'+ path.join(DIST, '/bundles', 'zone-extras.js'),
      ]
    })
    .transform(aliasify)
    .bundle()
    .pipe(source('common.js'))
    .pipe(gulp.dest(path.join(ROOT, DIST, '/bundles')))
});

// TODO: add comments
gulp.task('optimize', function(next){
  // mock
  setTimeout(next, 1000)
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
