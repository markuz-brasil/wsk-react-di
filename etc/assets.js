'use strict'

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
    .pipe($.size({title: 'es6'}))
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
