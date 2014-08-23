var path = require('path')
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var CFG = require('./tasks/config');
var TMP = CFG.tmp
var APP = CFG.app
var ROOT = CFG.root
// var WEB = CFG.web
// var DIST = CFG.dist
// var ROOT = CFG.root
// var BUILD = CFG.build

var BASE = path.join(TMP, path.basename(APP))

module.exports =  {
  tager: "web",
  entry: {
    p1: './'+ path.join(BASE, 'index.js'),
    p2: './'+ path.join(BASE, 'kitchen-di/main.js'),
    p3: './'+ path.join(BASE, 'jsx-app/jsx/app.js'),
  },
  output: {
    filename: path.join(BASE, "[name].chunk.js")
  },
  resolve: {
    root: '.',
    modulesDirectories: [".tmp/app/libs"],
    alias : {
      di: "di/index.js",
    }
  },
    module: {
      // ./.tmp/app/libs/zone.js
    loaders: [
      // { test: /\/assert.js$/, loader: 'exports-loader' },
      { test: /\.js$/, loader: 'source-map-loader' }, // loaders can take parameters as a querystring
      // { test: /\.jsx$/, loader: 'jsx-loader?harmony?insertProgma=React.DOM' }, // loaders can take parameters as a querystring
    ]
  },
  plugins: [
    new CommonsChunkPlugin(path.join(BASE, "common.chunk.js"))
  ],
  // extensions: ['','*.js', '*.jsx'],

}
