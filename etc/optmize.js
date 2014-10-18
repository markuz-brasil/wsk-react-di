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
    path.join(ROOT, TMP, APP),
    path.join(ROOT, TMP, APP, 'components/spec'),
  ],
  debug: true,
};

var aliasify = require('aliasify').configure({
  aliases: {
    di: './'+ path.join(TMP, LIBS, 'di/src'),
    co: './client/node_modules/co',
    assert: './client/node_modules/assert',
    react: './client/node_modules/react/addons.js',
    // react: './client/bower_components/react/react-with-addons.js',

    spec: './'+ path.join(TMP, 'client/app/components/spec'),
    libs: './'+ path.join(TMP, 'client/app/components/libs'),
    main: './'+ path.join(TMP, 'client/app/components/main'),
    core: './'+ path.join(TMP, 'client/app/components/core'),
  },
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
    .plugin('factor-bundle', {
      o: [
        './'+ path.join(DIST, '/bundles', 'app.js'),
        './'+ path.join(DIST, '/bundles', 'spec.js'),
      ]
    })
    // .plugin('minifyify', {map: 'app.map.json', output: './'+ path.join(DIST, '/bundles', 'app.map.json')})
    .transform(aliasify)
    .bundle()
    .pipe(source('libs.js'))
    .pipe(gulp.dest(path.join(ROOT, DIST, '/bundles')))
});


var browserifyConfigShims = {
  entries: [
    path.join(ROOT, TMP, APP, 'public/es6-shims'),
    path.join(ROOT, TMP, APP, 'public/zone-extras'),
  ],
  debug: true,
};


var aliasifyShims = require('aliasify').configure({
  aliases: {
    zone: './'+ path.join(TMP, LIBS, 'zone.js'),
    'es6-shim': './client/node_modules/gulp-6to5/node_modules/6to5/node_modules/es6-shim/es6-shim.js',
    'regenerator-runtime': './client/node_modules/gulp-6to5/node_modules/6to5/node_modules/regenerator/runtime.js',
  },
})

// TODO: add comments
gulp.task('browserify:shims', function(next){
  // need to create bundles dir before browserify needs
  try {
    fs.mkdirSync(path.join(ROOT, DIST))
    fs.mkdirSync(path.join(ROOT, DIST, '/bundles'))
  }
  catch (err) {
    // ignoring if file already exists :)
    if (err.errno !== 47) { throw err }
  }

  return browserify(browserifyConfigShims)
    .plugin('factor-bundle', {
      o: [
        './'+ path.join(DIST, '/bundles', '.shims.js'),
        './'+ path.join(DIST, '/bundles', 'zone-extras.js'),
      ]
    })
    // .plugin('minifyify', {map: 'es6-shim.map.json', output: './'+ path.join(DIST, '/bundles', 'es6-shim.map.json')})
    .transform(aliasifyShims)
    .bundle()
    .pipe(source('es6-shim.js'))
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
