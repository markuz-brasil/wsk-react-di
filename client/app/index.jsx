"use strict"
import { React } from 'libs'
import { Main } from 'main'

var t0 = new Date

React.initializeTouchEvents(true)
React.renderComponent(<Main />, document.getElementById('react-app'));

var t1 = new Date
console.log(`**** post render Main (${t1 - t0}ms)`)


