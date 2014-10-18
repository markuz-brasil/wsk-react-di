// require('./components/libs')
// import {App} from './components/Main'
"use strict"
import {co, React, Injector} from 'libs'
import {BaseView} from 'core'
console.log('**** main')

export class AppView extends BaseView {
  constructor(state){ return super(state) }

  render () {
    return (
      <div> {`... AppView ${this.state.ctx} ...`} </div>
    )
  }
}

export var App = new AppView({ctx: 'aAA'})

