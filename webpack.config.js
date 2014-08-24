var path = require('path')
var chop = require("webpack/lib/optimize/CommonsChunkPlugin");

var CFG = require('./tasks/config');
var TMP = CFG.tmp
var APP = CFG.app
var ROOT = CFG.root
var LIBS = CFG.libs
var BASE = path.join(TMP, path.basename(APP))

module.exports =  {
  tager: "web",
  devtool: 'inline-source-map',
  entry: {
    p1: './'+ BASE +'/wsk-app/index.js',
    p2: './'+ BASE +'/kitchen-di/main.js',
    p3: './'+ BASE +'/jsx-app/jsx/app.js',
  },
  output: {
    filename: BASE +'/[name].chunk.js'
  },
  resolve: {
    root: ROOT,
    modulesDirectories: [
      BASE,
      path.join(TMP, path.basename(LIBS)),
    ],

    alias : {
      di: 'di/index.js',
    }
  },
    module: {
    loaders: [
      { test: /\.js$/, loader: 'source-map-loader' }, // loaders can take parameters as a querystring
    ]
  },
  plugins: [
    new chop(BASE +'/c2.chunk.js', ['p1', 'p2']),
    new chop(BASE +'/c1.chunk.js', ['p3', BASE +'/c2.chunk.js']),
  ],

}
