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

var TMP = 'tmp'
var APP = 'client/app'
var LIBS = 'libs'
var DIST = path.join(TMP, 'dist')
var ES5 = 'es5'
var ROOT = process.cwd()
var APP_TMP = path.join(TMP, path.basename(APP))

var TASKS = {}
process.argv.forEach(function(task, i){
  if (i < 2) {return}
  TASKS[task] = true
})

module.exports = {
  root: ROOT,
  tmp: TMP,
  app: APP,
  libs: LIBS,
  dist: DIST,
  es5: ES5,
  tasks: TASKS,

  cssPrefixer: [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ],
  throw : function(err) {
    throw err
  },

  browserSync: function(){
    return {
      server: {
        baseDir: [
          DIST,
          path.join(TMP, DIST),
          path.join(TMP, ES5),
          path.join(TMP, APP),
          path.join(APP, 'public'),
          'client/bower_components'
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
  },

  traceur: function() {
    return  {
      // modules: 'commonjs',
      sourceMaps: true,
      outputLanguage: 'es6',
      // ES6
      // symbols: true, // buggy
      blockBinding: true, // noisy
      // ES7
      asyncFunctions: true, // noisy
      exponentiation: true,
      arrayComprehension: true,
      // generatorComprehension: true, // noisy
      // options for DI
      types: true,
      typeAssertions: true,
      typeAssertionModule: 'rtts-assert',
      annotations: true,
    }
  },
}

