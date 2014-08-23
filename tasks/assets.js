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
var path = require('path')

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var es6ify = require('es6ify');
var reactify = require('reactify');

var browserify   = require('browserify');
var watchify     = require('watchify');
var source       = require('vinyl-source-stream');
var aliasify = require('aliasify')

// gulp.task('browserify', function() {

//   var bundleMethod = global.isWatching ? watchify : browserify;

//   var bundler = bundleMethod({
//     // Specify the entry point of your app
//     entries: [
//     './app/main.js',
//     './app/jsx-app/jsx/app.jsx',
//     ],
//     // Add file extentions to make optional in your requires
//     extensions: ['.jsx', '.js'],
//     // Enable source maps!
//     debug: true
//   });

//   var bundle = function() {
//     // Log when bundling starts
//     // bundleLogger.start();

//     return bundler
//       .bundle()
//       // Report compile errors
//       // .on('error', handleErrors)
//       // Use vinyl-source-stream to make the
//       // stream gulp compatible. Specifiy the
//       // desired output filename here.
//       .pipe(source('app.js'))
//       // Specify the output destination
//       .pipe(gulp.dest('./.tmp/build/'))
//       // Log when bundling completes!
//       // .on('end', bundleLogger.end);
//   };

//   if(global.isWatching) {
//     // Rebundle with watchify on changes.
//     bundler.on('update', bundle);
//   }

//   return bundle();
// });


var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var CFG = require('./config');
var ROOT = CFG.root
var TMP = CFG.tmp
var APP = CFG.app
var BUILD = CFG.build
var WEB = CFG.web

var DEST = path.join(TMP, APP)
var traceurOps ={
  modules: 'commonjs',
  types: true,
  typeAssertions: true,
  typeAssertionModule: 'rtts-assert',
  annotations: true,
  sourceMaps: true
}

// Compile and Automatically Prefix Stylesheets
gulp.task('assets:less', function () {
  return gulp.src([
      path.join(APP, '**/*.less'),
    ])
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'less'}));
});

// TODO: add comments
gulp.task('assets:jade', function(){
  return gulp.src([
      path.join(APP, '**/*.jade'),
    ])
    .pipe($.sourcemaps.init())
    .pipe($.jade({pretty: true}))
    .on('error', console.error.bind(console))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'jade'}))
});

// TODO: write comments
gulp.task('assets:es7:copy-deps', function(cb){
  return gulp.src([
      'node_modules/di/src/*.js',
      'node_modules/zone.js/*zone.js',
    ])
    .pipe(gulp.dest('libs'))
});

// TODO: write comments
gulp.task('assets:es7:deps', function(cb){
  return gulp.src('libs/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.traceur(traceurOps))
    .on('error', console.error.bind(console))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(DEST+ '/libs'))
    .pipe($.size({title: 'es7:deps'}))
});

gulp.task('assets:react', function(cb){
  return gulp.src([
      path.join(APP, '**/*.jsx'),
    ])
    .pipe($.react({harmony: true, sourceMap: true}))
    .pipe($.sourcemaps.init())
    .pipe($.traceur(traceurOps))
    .on('error', console.error.bind(console))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'es7'}))
});

gulp.task('assets:es7', function(cb){
  return gulp.src([
      path.join(APP, '**/*.js'),
    ])
    .pipe($.sourcemaps.init())
    .pipe($.traceur(traceurOps))
    .on('error', console.error.bind(console))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'es7'}))
});

gulp.task('assets:webpack:dev', function(cb){
  // executing pub build
  var cmd = exec('webpack -d', {cwd: ROOT});
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', cb);
});

// TODO: add comments
gulp.task('assets:js', function(cb){
  runSequence([
    'assets:es7', 'assets:es7:deps', 'assets:react'],
    'assets:webpack:dev', cb)
})

// TODO: add comments
gulp.task('assets', ['clean'], function(cb){
  runSequence([
    'assets:less',
    'assets:jade',
    'assets:js'], cb)

})


// TODO: add comments
// gulp.task('assets:copy', function(){
//   return gulp.src([
//       path.join(APP, 'pubspec.yaml'),
//       path.join(APP, 'pubspec.lock'),
//       path.join(APP, 'build.dart')

//     ])
//     .pipe(gulp.dest(DEST))
//     .pipe($.size({title: 'assets:copy'}))
// });

// executing pub build
// gulp.task('assets:pub', ['assets:copy'], function(cb){
//   var cmd = exec('pub get', {cwd: DEST});
//   // cmd.stdout.pipe(process.stdout);
//   cmd.stderr.pipe(process.stderr);
//   cmd.on('close', cb);
// })



// // TODO: write the equivalent of dart
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





