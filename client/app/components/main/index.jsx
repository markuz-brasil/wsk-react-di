
"use strict"
import {co, React, di} from 'libs'
import {
  ReactStore,
  ReactState,
  ReactElem,
  createReactCtrl
} from 'core'

import { Store, InitState } from './state'

var {
  Inject,
  InjectLazy,
  Injector,
  annotate,
  Provide,
  TransientScope
} = di

export function Main (...args) {
  var injector = new Injector([RootElem, InitState, Store])
  Store().injector = injector
  return createReactCtrl(injector)(...args)
  // return createReactCtrl(new Injector([]))(...args)
}

annotate(RootElem, new TransientScope)
annotate(RootElem, new Provide(ReactElem))
annotate(RootElem, new Inject(ReactStore))
function RootElem (store) {
  return (
    <div key='RootElem'>
      <div key='ElemWrap'>
        {"This is the state status:"}
        <div key='StatusElem'> {store.context.state.status} </div>
      </div>
    </div>
  )
}



