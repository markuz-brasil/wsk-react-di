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

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var log = $.util.log;
var red = $.util.colors.red;

var watch = require('./watch');
var CFG = require('./config');
var TMP = CFG.tmp
var APP = CFG.app
var WEB = CFG.web
var DIST = CFG.dist
var BUILD = CFG.build

var OPTS = {
  notify: false,
  port: 3000,
  // browser: 'chromium',
  // browser: 'skip',
  // forces full page reload on css changes.
  injectChanges: false,
  // Run as an https by uncommenting 'https: true'
  // Note: this uses an unsigned certificate which on first access
  //       will present a certificate warning in the browser.
  // https: true,
  server: {
    baseDir: []
  }
}
// Watch Files For Changes & Reload
gulp.task('serve', ['assets'], function () {
  var opts = OPTS
  opts.browser = 'skip'
  opts.server.baseDir = [path.join(TMP, APP), APP, 'bower_components']
  watch.assets(reload)
  browserSync(opts);
});

// // Build and serve the output from the dist build
// gulp.task('serve:react', ['assets:react'], function () {
//   var opts = OPTS
//   opts.port = 3001
//   opts.server.baseDir = path.join(TMP, 'jsx-app/')
//   watch.build(reload)
//   browserSync(opts);
// });

// // Build and serve the output from the dist build
// gulp.task('serve:dist', ['dist'], function () {
//   var opts = OPTS
//   opts.port = 3002
//   opts.server.baseDir = DIST
//   watch.dist(reload)
//   browserSync(opts);
// });
// // Build and serve the output from the dist build
// gulp.task('serve:build', ['default', 'watcher'], function () {
//   browserSync({
//     notify: false,
//     // Run as an https by uncommenting 'https: true'
//     // Note: this uses an unsigned certificate which on first access
//     //       will present a certificate warning in the browser.
//     // https: true,
//     browser: 'skip',
//     // forces full page reload on css changes.
//     injectChanges: false,
//     server: {
//       baseDir: 'build/web'
//     }
//   });
// });

