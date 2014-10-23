'use strict'

var path = require('path')

var TMP = 'tmp'
var CLIENT = 'client'
var APP = path.join(CLIENT, 'app')
var LIBS = 'libs'
var DIST = path.join(TMP, 'dist')
var ES5 = 'es5'
var ROOT = process.cwd()
var APP_TMP = path.join(TMP, path.basename(APP))

var CFG = {
  pub: 'tmp/public',
  tmp: 'tmp',
  src: 'client',
  vendors: 'tmp/vendors',
  tasks: {},
}

var SRC = CFG.src
var VENDORS = CFG.vendors
var PUB = CFG.pub

CFG.throw = console.error.bind(console)
process.argv.forEach(function(task, i){
  if (i < 2) {return}
  CFG.tasks[task] = true
})

CFG.browserSync = function browserSync () {
  return {
    server: {
      baseDir: [
        SRC +'/public',
        VENDORS,
        PUB,
      ]
    },
    ghostMode: false,
    notify: false,
    port: 3000,
    // browser: 'chrome',
    // browser: 'skip',

    // forces full page reload on css changes.
    // injectChanges: false,

    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
  }
}

module.exports = CFG

