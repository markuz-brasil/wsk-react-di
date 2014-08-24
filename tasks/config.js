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

module.exports = {
  root: process.cwd(),
  tmp: '.tmp',
  app: 'app',
  dist: 'dist',
  libs: 'libs',
  web: 'web',
  build: 'build',

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
    // browser: 'chrome',
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
    types: true,
    typeAssertions: true,
    typeAssertionModule: 'rtts-assert',
    annotations: true,
    sourceMaps: true
  },
}

