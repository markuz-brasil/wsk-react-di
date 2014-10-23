
"use strict"

import { React, less } from 'runtime'
import { co, di } from 'libs'

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
  InjectPromise,
  Injector,
  annotate,
  Provide,
  ProvidePromise,
  TransientScope
} = di

export function Main (...args) {
  var injector = new Injector([RootElem, InitState, Store])
  Store().injector = injector
  return createReactCtrl(injector)(...args)
  // return createReactCtrl(new Injector([]))(...args)
}

function RenderStyles (str) {
  return new Promise((resolve, reject) => {
    setImmediate(() =>{
      less.render(str, {compress: true}, function (err, css) {
        if (err) { return reject(err) }
        resolve(css)
      })
    })
  })
}

annotate(InitState, new Inject(RootStyles))
annotate(RootStyles, new Inject(ReactStore))
function RootStyles (store) {
  RenderStyles(`
    #react-app {
      background: linear-gradient(to bottom, lighten(#f5f5f5, 20%) 0%, darken(#f5f5f5, 3%) 70%,darken(#f5f5f5, 3%) 71%, lighten(#f5f5f5, 10%) 100%);
      border-radius: 0px;
      margin-bottom: 0px;
    }
  `).then((css) => {
    store.get(RootElem).style = css
    store.context.forceUpdate()
  })

  return {style: "#react-app{display:none}"}
}

annotate(RootElem, new TransientScope)
annotate(RootElem, new Provide(ReactElem))
annotate(RootElem, new Inject(ReactStore, RootStyles))
function RootElem (store, styles) {
  if (!store.has(RootElem)) {
    store.set(RootElem, styles)
  }

  return (
    <div key='RootElem'>
      <div key="style-wrap" dangerouslySetInnerHTML={{__html:
        `<style key="styles" > ${store.get(RootElem).style} </style>` }} />

      <div key='ElemWrap'>
        {"This is the state status:"}
        <div key='StatusElem'> {store.context.state.status} </div>
      </div>
    </div>
  )
}




