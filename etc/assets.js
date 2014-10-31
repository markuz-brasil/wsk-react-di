'use strict'

var path = require('path')
var exec = require('child_process').exec
var fs = require('fs')

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var del = require('del')
var runSequence = require('run-sequence')
var thr = require('through2').obj

var browserify =  require('browserify')
var to5Browserify = require('6to5-browserify')
var aliasify = require('aliasify')
var vinylify = require('vinyl-source-stream2')

var CFG = require('./config');
var SRC = CFG.src
var TMP = CFG.tmp
var PUB = CFG.pub
var VENDORS = CFG.vendors.src

var log = $.util.log
var red = $.util.colors.red
var cyan = $.util.colors.cyan
var mag = $.util.colors.magenta

function bundleClosure (opt, next) {

  opt.sourcemaps = opt.sourcemaps || true
  opt.aliases = opt.aliases || {}
  opt.entry = opt.entry || './index.js'
  opt.basename = opt.basename || 'index.js'
  opt.dest = opt.dest || '.'
  opt.title = opt.title || opt.basename

  return browserify({debug: opt.sourcemaps, extensions: ['.js', '.jsx']})
    .transform(to5Browserify.configure({blacklist: ['forOf']}))
    .on('error', next)
    .transform(aliasify.configure({
      aliases: opt.aliases,
      appliesTo: {includeExtensions: ['.js', '.jsx']},
    }))
    .on('error', next)
    .transform('brfs')
    .require(opt.entry, {entry: true})
    .bundle()
    .on('error', next)
    .pipe(vinylify(opt.basename))
    .pipe($.sourcemaps.init({loadMaps: opt.sourcemaps}))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(opt.dest))
    .pipe($.size({title: 'js: '+ opt.title}))
    .pipe($.gzip())
    .pipe($.size({title: 'gz: '+ opt.title}))
    .pipe(gulp.dest(PUB +'/gzip'))
    .pipe(thr(function (){ next() }))
}

function bundleNamespace (opt, next) {

  opt.sourcemaps = opt.sourcemaps || true
  opt.aliases = opt.aliases || {}
  opt.entry = opt.entry || './index.js'
  opt.basename = opt.basename || 'index.js'
  opt.dest = opt.dest || '.'
  opt.title = opt.title || opt.basename
  opt.standalone = opt.standalone || opt.basename.split('.')[0]

  return browserify({
      debug: opt.sourcemaps,
      standalone: opt.standalone,
      extensions: ['.js', '.jsx'],
    })
    .transform(to5Browserify.configure({blacklist: ['forOf']}))
    .on('error', next)
    .transform(aliasify.configure({
      aliases: opt.aliases,
      appliesTo: {includeExtensions: ['.js', '.jsx']},
    }))
    .on('error', next)
    .transform('brfs')
    .require(opt.entry, {entry: true})
    .bundle()
    .on('error', next)
    .pipe(vinylify(opt.basename))
    .pipe($.sourcemaps.init({loadMaps: opt.sourcemaps}))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(opt.dest))
    .pipe($.size({title: 'js: '+ opt.title}))
    .pipe($.gzip())
    .pipe($.size({title: 'gz: '+ opt.title}))
    .pipe(gulp.dest(PUB +'/gzip'))
    .pipe(thr(function (){ next() }))
}

function bundleCommonjs (opt, next) {

  opt.sourcemaps = opt.sourcemaps || true
  opt.entry = opt.entry || './index.js'
  opt.dest = opt.dest || '.'
  opt.title = opt.title || opt.entry

  return gulp.src(opt.entry)
    .pipe($.cached('assets:commonjs', {optimizeMemory: true}))
    .pipe($.sourcemaps.init({loadMaps: opt.sourcemaps}))
    .pipe($['6to5']({blacklist: ['forOf']})).on('error', next)
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(opt.dest))
    .pipe($.size({title: 'cjs: '+ opt.title}))
    .pipe(thr(function (){ next() }))
}

// TODO: add comments
gulp.task('assets', function(next){
  runSequence(['assets:jade', 'assets:js'], next)
})

// TODO: add comments
gulp.task('assets:jade', function(){
  return gulp.src(SRC +'/index.jade')
    .pipe($.cached('assets:jade', {optimizeMemory: true}))
    .pipe($.jade({pretty: true}))
    .on('error', CFG.throw)
    .pipe(gulp.dest(PUB))
    .pipe($.size({title: 'jade'}))
});

// TODO: add comments
gulp.task('assets:js', function (next) {
  runSequence(['assets:client', 'assets:vendors'], next)
})

// TODO: add comments
gulp.task('clean:client', del.bind(null, [TMP +'/to5']));
gulp.task('assets:client', function(){
  return gulp.src(CFG.to5.entries)
    .pipe(thr(function (vfs, enc, next){
      var basename = path.basename(vfs.path)

      var opt = {
        sourcemaps: true,
        aliases: CFG.to5.aliases,
        entry: vfs.path,
        basename: path.basename(vfs.path),
        dest: PUB,
        title: 'client',
      }

      bundleClosure(opt, function (err) {
        if (err) console.error(err)
        next(null, vfs)
      })
    }))
    .pipe(thr(function (vfs, enc, next){ setTimeout(next, 50) }))
})

// TODO: add comments
gulp.task('clean:vendors', del.bind(null, [VENDORS]));
gulp.task('assets:vendors', ['assets:di'], function (){
  return gulp.src(CFG.vendors.entries)
    .pipe($.cached('assets:vendors', {optimizeMemory: true}))
    .pipe(thr(function (vfs, enc, next){

      var opt = {
        standalone: 'BundleNamespace.'+path.basename(vfs.path).replace(/\.js$/, ''),
        sourcemaps: true,
        aliases: CFG.vendors.aliases,
        entry: vfs.path,
        basename: path.basename(vfs.path),
        dest: PUB,
        title: path.basename(vfs.path).split('.')[0],
      }

      bundleNamespace(opt, function (err) {
        if (err) console.error(err)
        next(null, vfs)
      })
    }))
    .pipe(thr(function (vfs, enc, next){ setTimeout(next, 50) }))
})

// The ng's DI npm package is broken.
gulp.task('assets:di', function(next){

  var opt = {
    sourcemaps: true,
    entry: SRC +'/node_modules/di/src/**/*.js',
    dest: TMP +'/di',
    title: 'di',
  }

  return bundleCommonjs(opt, function (err) {
    if (err) return console.error(err)
    next()
  })
})
