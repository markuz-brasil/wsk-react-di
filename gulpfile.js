'use strict'

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var watch = require('./etc/watchers');
var CFG = require('./etc/config');

var log = $.util.log
var red = $.util.colors.red
var cyan = $.util.colors.cyan
var mag = $.util.colors.magenta

var TMP = CFG.tmp
var PUB = CFG.pub
var SRC = CFG.src
var TASKS = CFG.tasks

// Load custom tasks from the `tasks` directory
try { require('require-dir')('etc'); } catch (err) { console.error(err) }

// Clean Output Directory
gulp.task('clean', del.bind(null, [TMP, PUB]));

// TODO: add comments
gulp.task('default', ['build'])

// TODO: add comments
gulp.task('build', ['clean'], function(next){
  runSequence('assets', function(){
    if (browserSync.active) { gulp.start('reload') }
    next()
  })
})

var BS
// TODO: add comments
gulp.task('serve', function (next) {
  var opts = CFG.browserSync()
  opts.browser = opts.browser || 'skip'

  browserSync(opts, function(err, bs){
    if (err) {throw err}
    BS = bs
    log("Loaded '"+ cyan('browserSync') +"'...")
    next()
  });
});

// TODO: add comments
gulp.task('reload', function(next){
  browserSync.reload()
  BS.logger.info('Local URL: '+ mag(BS.options.urls.local))
  BS.logger.info('External URL: '+ mag(BS.options.urls.external))
  next()
});

// TODO: add comments
gulp.task('restart', function(){
  log(red(':: restarting ::'))
  process.exit(0)
})

// // TODO: add comments
gulp.task('watch', function(next){
  watch.gulpfile()
  watch.assets(TASKS)
  next()
})
