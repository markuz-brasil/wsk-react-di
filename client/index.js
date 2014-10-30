"use strict"
import { main, createReactCtrl } from 'main'
import { c0 } from 'libs'
import { React, less } from 'runtime'
import { readFileSync } from 'fs'

console.log(readFileSync('./LICENSE', 'utf8'))


React.initializeTouchEvents(true)

c0(function * () {
  var t0 = new Date

  var ViewCtrl = React.createClass(yield createReactCtrl())
  React.renderComponent(<ViewCtrl />, document.getElementById('react-app'));

  var t1 = new Date
  console.log(`*** first paint took: (${t1 - t0}ms) ***`)

})()




