'use strict'

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var log = $.util.log
var red = $.util.colors.red
var cyan = $.util.colors.cyan

var watch = require('./etc/watchers');

var CFG = require('./etc/config');
var TMP = CFG.tmp
var APP = CFG.app
var DIST = CFG.dist

var TASKS = CFG.tasks

// Load custom tasks from the `tasks` directory
try { require('require-dir')('etc'); } catch (err) {
  console.log(err)
}

// Clean Output Directory
gulp.task('clean', del.bind(null, [TMP, DIST]));

// TODO: add comments
gulp.task('default', ['build'])

// TODO: add comments
gulp.task('dev', ['clean'], function(next){
  runSequence('assets', function(){

    if (browserSync.active && !TASKS.build) { gulp.start('reload') }

    if (TASKS.test && !TASKS.build) {
      runSequence('assets:test', function(){
        if (!TASKS.serve) {browserSync.exit()}
      })
    }

    next()
  })
})

// TODO: add comments
gulp.task('build', ['dev'], function(next){
  runSequence('optimize', function(){

    if (browserSync.active) { gulp.start('reload') }

    if (TASKS.test) {
      runSequence('assets:test', function(){
        if (!TASKS.serve) {browserSync.exit()}
      })
    }
    next()
  })
})

// TODO: add comments
gulp.task('watch', function(next){
  watch.gulpfile()

  if (TASKS.test) {
    watch.test(TASKS)
  }
  else {
    watch.assets(TASKS)
  }

  next()
})

// Watch Files For Changes & Reload
gulp.task('serve', function (next) {
  var opts = CFG.browserSync()
  opts.browser = 'skip'

  browserSync(opts, function(err, bs){
    if (err) {throw err}
    log("Loaded '"+ cyan('browserSync') +"'...")
    next()
  });
});

// TODO: add comments
gulp.task('reload', function(next){
  browserSync.reload()
  next()
});

// TODO: add comments
gulp.task('restart', function(){
  log(red(':: restarting ::'))
  process.exit(0)
})

// TODO: add comments
gulp.task('test', ['serve', 'dev'])



