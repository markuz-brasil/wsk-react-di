'use strict'

var path = require('path')
var exec = require('child_process').exec
var fs = require('fs')

// Include Gulp & Tools We'll Use
var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var del = require('del')
var runSequence = require('run-sequence')
var thr = require('through2').obj
var browserify =  require('browserify')
var aliasify = require('aliasify')
var source = require('vinyl-source-stream2')

var CFG = require('./config');
var SRC = CFG.src
var TMP = CFG.tmp
var PUB = CFG.pub
var VENDORS = CFG.vendors

// TODO: add comments
gulp.task('assets', function(next){
  runSequence(['assets:jade', 'assets:js'], next)
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
  runSequence('assets:es6', ['assets:bundle', 'assets:vendors'], next)
})

// TODO: add comments
gulp.task('clean:es6', del.bind(null, [TMP +'/es6']));
gulp.task('assets:es6', function(next){
  return gulp.src([
      SRC +'/{index,src/**/*,vendors/**/*,node_modules/di/src/**/*}.{js,jsx}',
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

  var entry = './'+ TMP + '/es6/index.js'
  var basename = path.basename(entry)

  return browserify({entries:[entry], debug: true})
    .transform(aliasify.configure({
      aliases: {
        libs: './'+ TMP +'/es6/src/core/libs',
        runtime: './'+ TMP +'/es6/src/core/runtime',
        main: './'+ TMP +'/es6/src/main',
        core: './'+ TMP +'/es6/src/core',
      },
    }))
    .transform('brfs')
    .bundle()
    .pipe(source(basename))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(PUB))
    .pipe($.size({title: 'js:bundle'}))
})

// TODO: add comments
gulp.task('clean:vendors', del.bind(null, [VENDORS]));
gulp.task('assets:vendors', function (){
  var entries = [
    './'+ TMP + '/es6/vendors/libs.js',
    './'+ TMP + '/es6/vendors/runtime.js',
    './'+ TMP + '/es6/vendors/shims.js',
  ]

  var aliases = aliasify.configure({
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

  return gulp.src(entries)
    .pipe($.cached('assets:vendors', {optimizeMemory: true}))
    .pipe(thr(function (vfs, enc, next){
      var entry = vfs.path
      var basename = path.basename(entry)
      var id = 'BundleNamespace.'+ basename.replace(/\.js$/, '')

      browserify({entries:[entry], standalone: id, debug: true})
        .transform(aliases)
        .transform('brfs')
        .bundle()
        .pipe(source(basename))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./maps'))
        .pipe(gulp.dest(VENDORS))
        .pipe($.size({title: basename}))
        .pipe(thr(function (){ next(null, vfs) }))
    }))
    .pipe(thr(function (vfs, enc, next){ setTimeout(next, 50) }))
})
