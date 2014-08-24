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
var chop = require("webpack/lib/optimize/CommonsChunkPlugin");
var webpack = require('webpack')

var TMP = '.tmp'
var APP = 'app'
var LIBS = 'libs'
var ROOT = process.cwd()
var APP_TMP = path.join(TMP, path.basename(APP))

module.exports = {
  root: ROOT,
  tmp: TMP,
  app: APP,
  libs: LIBS,

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

  browserSync: {
    notify: false,
    port: 3000,
    browser: 'chrome',
    // browser: 'skip',

    // forces full page reload on css changes.
    injectChanges: false,

    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: []
    }
  },

  traceur: {
    modules: 'commonjs',
    sourceMaps: true,
    // ES6
    // symbols: true, // buggy
    blockBinding: true, // noisy
    // ES7
    asyncFunctions: true, // noisy
    exponentiation: true,
    arrayComprehension: true,
    generatorComprehension: true, // noisy
    // options for DI
    types: true,
    typeAssertions: true,
    typeAssertionModule: 'rtts-assert',
    annotations: true,
  },

  webpack: {
    target: "web",
    // devtool: 'source-map',
    // devtool: 'inline-source-map',
    entry: {
      p1: './'+ APP_TMP +'/wsk-app/index.js',
      p2: './'+ APP_TMP +'/kitchen-di/main.js',
      p3: './'+ APP_TMP +'/jsx-app/jsx/app.js',
      p4: './.tmp/libs/through2/index.js',
    },
    output: {
      filename: APP_TMP +'/[name].chunk.js'
    },
    resolve: {
      root: ROOT,
      modulesDirectories: [
        APP_TMP,
        path.join(TMP, path.basename(LIBS)),
        './node_modules/',
      ],

      alias : {
        di: 'di/index.js',
        through2: 'through2/through2.js'
      }
    },
      module: {
      loaders: [
        { test: /\.js$/, loader: 'source-map-loader' }, // loaders can take parameters as a querystring
      ]
    },
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new chop(APP_TMP +'/c2.chunk.js', ['p1', 'p2']),
      new chop(APP_TMP +'/c1.chunk.js', ['p3', APP_TMP +'/c2.chunk.js']),
      // new webpack.optimize.UglifyJsPlugin(),
      new webpack.SourceMapDevToolPlugin("[file].map", "\n//# sourceMappingURL=maps/[url]")
    ],
  },
}

