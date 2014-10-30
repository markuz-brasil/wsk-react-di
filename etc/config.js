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
  vendors: {},
  to5: {},
  tasks: {},
}
var SRC = CFG.src
var TMP = CFG.tmp
var PUB = CFG.pub

CFG.to5.entries = SRC +'/index.js'
CFG.to5.aliases = {
  libs: './'+ SRC +'/src/libs',
  runtime: './'+ SRC +'/src/libs/runtime',
  main: './'+ SRC +'/src/main',
  flux: './'+ SRC +'/src/flux',
  core: './'+ SRC +'/src/core',
}

CFG.vendors.src = 'tmp/vendors'
CFG.vendors.entries = SRC + '/vendors/{core-libs,runtime,shims}.js'
CFG.vendors.aliases ={
  di: './'+ TMP +'/di',
  co: './'+ SRC +'/node_modules/co',
  assert: './'+ SRC +'/node_modules/assert',
  react: './'+ SRC +'/node_modules/react/addons',
  less: './'+ SRC +'/node_modules/less',
  setimmediate: './'+ SRC +'/node_modules/setimmediate/setImmediate',
  'es6-shim': './'+ SRC +'/node_modules/6to5/node_modules/es6-shim/es6-shim',
  'regenerator-runtime': './'+ SRC +'/node_modules/6to5/node_modules/regenerator/runtime',
}

var VENDORS = CFG.vendors.src

CFG.throw = console.error.bind(console)
process.argv.forEach(function(task, i){
  if (i < 2) {return}
  CFG.tasks[task] = true
})

CFG.browserSync = function browserSync () {
  return {
    server: {
      baseDir: [ SRC +'/public', VENDORS, PUB ]
    },
    ghostMode: false,
    notify: false,
    port: 3000,
    browser: 'skip',
    // browser: 'chrome',

    // forces full page reload on css changes.
    // injectChanges: false,

    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
  }
}

module.exports = CFG
