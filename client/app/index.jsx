// require('./components/libs')
// import {App} from './components/Main'
"use strict"
import {co, React, Injector} from 'libs'
import {App} from 'main'

console.log('**** pre render app')

React.initializeTouchEvents(true)
React.renderComponent(<App />, document.getElementById('react-app'));

console.log('**** post render app')


