'use strict'

var path = require('path')
var exec = require('child_process').exec
var fs = require('fs')

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var thr = require('through2').obj
var aliasify = require('aliasify')

var CFG = require('./config');
var SRC = CFG.src
var TMP = CFG.tmp
var PUB = CFG.pub
var VENDORS = CFG.vendors

var aliasifyVendors = aliasify.configure({
  aliases: {
    di: './'+ TMP +'/es6/node_modules/di/src',
    co: './'+ SRC +'/node_modules/co',
    assert: './'+ SRC +'/node_modules/assert',
    react: './'+ SRC +'/node_modules/react/addons',
    less: './'+ SRC +'/node_modules/less',
    setimmediate: './'+ SRC +'/node_modules/setimmediate/setImmediate',
    'es6-shim': './'+ SRC +'/node_modules/6to5/node_modules/es6-shim/es6-shim',
    'regenerator-runtime': './'+ SRC +'/node_modules/6to5/node_modules/regenerator/runtime',
  },
})

var aliasifyBundle = aliasify.configure({
  aliases: {
    libs: './'+ TMP +'/es6/src/core/libs',
    runtime: './'+ TMP +'/es6/src/core/runtime',
    main: './'+ TMP +'/es6/src/main',
    core: './'+ TMP +'/es6/src/core',
  },
})

// TODO: add comments
gulp.task('assets', function(next){
  runSequence(['assets:js', 'assets:jade'], next)
})

// TODO: add comments
gulp.task('assets:js', function(next){
  runSequence('assets:es6', ['assets:vendors', 'assets:bundle'], next)
})

// TODO: add comments
gulp.task('assets:jade', function(){
  return gulp.src([
      SRC +'/index.jade'
    ])
    .pipe($.cached('assets:jade', {optimizeMemory: true}))
    .pipe($.jade({pretty: true}))
    .on('error', CFG.throw)
    .pipe(gulp.dest(PUB))
    .pipe($.size({title: 'jade'}))
});

gulp.task('assets:js', function (next) {
  runSequence('assets:es6', 'assets:bundle', next)
})

// TODO: add comments
gulp.task('clean:es6', del.bind(null, [TMP +'/es6']));
gulp.task('assets:es6', function(next){
  return gulp.src([
      SRC +'/{index,src/**/*,node_modules/di/src/**/*}.{js,jsx}',
    ])
    .pipe($.cached('assets:es6', {optimizeMemory: true}))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.rename(function(path){path.extname = ".js"}))
    .pipe($['6to5']()).on('error', CFG.throw)
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(TMP +'/es6'))
    .pipe($.size({title: 'js:es6'}))
})

// TODO: add comments
gulp.task('clean:bundle', del.bind(null, [TMP +'/bundle']));
gulp.task('assets:bundle', function(next){
  return gulp.src([
      TMP + '/es6/index.js',
    ])
    .pipe($.browserify({debug: true, transform: [aliasifyBundle, 'brfs'],}))
    .on('error', CFG.throw)
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify())
    .on('error', CFG.throw)
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(PUB))
    .pipe($.size({title: 'js:bundle'}))
})

// TODO: add comments
gulp.task('clean:vendors', del.bind(null, [VENDORS]));
gulp.task('assets:vendors', ['clean:vendors', 'assets:es6'], function(next){
  return gulp.src([
      TMP + '/es6/src/vendors/libs.js',
      TMP + '/es6/src/vendors/runtime.js',
      TMP + '/es6/src/vendors/shims.js',
    ])
    // .pipe($.cached('assets:vendors', {optimizeMemory: true}))
    .pipe(thr(function (vfs, enc, next){
      var id = 'ModuleNamespace.'+ path.basename(vfs.path).replace(/\.js$/, '')
      gulp.src(vfs.path)
        .pipe($.browserify({debug: true, transform: [aliasifyVendors], standalone: id}))
        .pipe(thr(function (vfs, e, n){
          next(null, vfs)
          n()
        }))
    }))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(VENDORS))
    .pipe($.size({title: 'js:vendors'}))
})



