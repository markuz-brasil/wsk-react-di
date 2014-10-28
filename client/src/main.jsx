
"use strict"

import { React } from 'runtime'
import { co, di } from 'libs'


export {createReactCtrl} from 'core'

import {
  ReactStore,
  ReactState,
  ReactElem,
  createReactCtrl,
  renderStyle
} from 'core'

import { Store, InitState } from './state'

var {
  Inject,
  InjectLazy,
  InjectPromise,
  Injector,
  annotate,
  Provide,
  ProvidePromise,
  TransientScope
} = di

function createReactStyle (str) {
  return React.createClass({
    render () {
      return <div dangerouslySetInnerHTML={{__html: `<style> ${str} </style>` }} />
    },
  })
}

export function main () {
  return <Main />
}

function Main (...args) {
  var injector = new Injector([RootElem, InitState, Store])
  Store().injector = injector
  // return createReactCtrl(injector)(...args)
  return createReactCtrl(new Injector([]))(...args)
}

annotate(InitState, new Inject(RootStyles))
annotate(RootStyles, new Inject(ReactStore))
function RootStyles (store) {
  renderStyle(`
    background: linear-gradient(to bottom, lighten(#f5f5f5, 20%) 0%, darken(#f5f5f5, 3%) 70%,darken(#f5f5f5, 3%) 71%, lighten(#f5f5f5, 10%) 100%);
    border-radius: 0px;
    margin-bottom: 0px;
  `).then((css) => {
    store.get(RootElem).style = css
    store.context.forceUpdate()
  }, console.error.bind(console))

  return {style: "#react-app{display:none}"}
}

annotate(RootElem, new TransientScope)
annotate(RootElem, new Provide(ReactElem))
annotate(RootElem, new Inject(ReactStore, RootStyles))
function RootElem (store, styles) {
  if (!store.has(RootElem)) { store.set(RootElem, styles) }

  var RootStyles = createReactStyle(store.get(RootElem).style)
  return (
    <div>
      <RootStyles key='RootStyle' />
      <div key='RootElem'>
        {"This is the state status:"}
        <div key='StatusElem'> {store.context.state.status} </div>
      </div>
    </div>
  )
}
