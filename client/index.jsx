"use strict"
// import { React } from 'libs'
import { Main } from 'main'

import { React, less } from 'runtime'
import { co, di, assert } from 'libs'

import {readFileSync} from 'fs'


var t0 = new Date


console.log(readFileSync('./LICENSE', 'utf8'))
React.initializeTouchEvents(true)
React.renderComponent(<Main />, document.getElementById('react-app'));

var t1 = new Date
console.log(`*** post render Main (${t1 - t0}ms)`)
