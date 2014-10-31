
"use strict"

import { React } from 'runtime'
import { co, di } from 'libs'



import { createReactCtrl } from 'flux'

import { Store, InitState } from './state'

var {
  Injector,
  annotate,
  Provide,
  ProvidePromise,
  TransientScope
} = di

export {createReactCtrl}

export function main () {
  return <Main />
}

function Main (...args) {
  // var injector = new Injector([RootElem, InitState, Store])
  // Store().injector = injector
  // return createReactCtrl(injector)(...args)
  return createReactCtrl(new Injector([]))(...args)
}




// function FluxStyle () {
//   return function * FluxStyle () {
//     yield (next) => setTimeout(next, Math.random()*10|0)
//     return { background: 'cbcbcb' }
//   }
// }


// _store.initState = function * initState () {
//   var t0 = new Date
//   console.log('2: store')
//   yield (next) => setTimeout(next, Math.random()*10|0)
//   console.log('2: done store', new Date - t0)

//   var delta = () => (_store.t1 - _store.t0)|0

//   _store.state = {}
//   Object.assign(_store.state, {
//     msg:  `
//       first paint @ ${delta()}ms ::
//       ${_store.pagePaints} injected @
//       ${(_store.pagePaints*1000/(delta()))|0} FPS
//     `
//   })

//   return {
//     getInitialState() {
//       _store.context = this
//       _store.setState = this.setState.bind(_store.context)
//       return _store.state
//     },
//   }
// }


// annotate(PreRender, new Inject(FluxStyle))
// function PreRender (style) {

//   var _view = {}

//   _view.initRender = function * renderGen() {
//     var t0 = new Date
//     console.log('1: view')
//     _view.style = yield style
//     console.log('1: done view',  new Date - t0)
//     return {
//       render () {
//         // console.log(this.state)
//         return <div style={ this.state.style }> { this.state.msg } </div>
//       },
//     }
//   }

//   return _view

// }



// // creating a thunk around less.render to use with c0
// var _lessCfg = {compress: true}
// var _div = document.createElement('div')
// var _id = `tmp-id-${Math.random().toString().split('.')[1]}`
// var _regex = new RegExp(`(^#${_id}{|}$)`)



// // function * ReactLess () {
// //   return yield renderStyle `
// //     background: linear-gradient(to bottom, lighten(#55f5ab, 20%) 0%, darken(#f5f5f5, 3%) 70%,darken(#f5f5f5, 3%) 71%, lighten(#f5f5f5, 10%) 100%);
// //   `
// // }

// function randColor () {
//   return (Math.random() * (255 - 0))|0 + 0
// }

// function randPer () {
//   return (Math.random() * (10 - 0))|0 + 0
// }


// var _store = {}
// function ReactLess () {
//   return function * ReactLessRand () {
//     var x0 = randPer()
//     var style = `
//       color: rgb(${randColor()}, ${randColor()}, ${randColor()});
//       background: linear-gradient(
//         to bottom,
//         lighten(rgb(${randColor()}, ${randColor()}, ${randColor()}), ${randPer()}%) 0%,
//         darken(rgb(${randColor()}, ${randColor()}, ${randColor()}), ${randPer()}%) ${x0}%,
//         darken(rgb(${randColor()}, ${randColor()}, ${randColor()}), ${randPer()}%) ${x0+1}%,
//         lighten(rgb(${randColor()}, ${randColor()}, ${randColor()}), ${randPer()}%) 100%
//       );
//     `
//     _store.style = yield renderStyle(style)
//   }
// }


// function renderStyle (str = 'display: none;', opts = _lessCfg) {
//   // this is equivalent of returning a promise. but better performace
//   return function (next) {
//     less.render(`#${_id}{ ${str} }`, opts, (err, value) => {
//       // fix string
//       value = value.replace(_regex, '')
//       _div.style.cssText = value
//       var style = {}

//       for (let item of _div.style) {
//         if (style[item] !== '') {
//           style[item] = _div.style[item]
//         }
//       }
//       next(err, style)
//     })
//   }
// }


// ####################################################################
// ####################################################################
// ####################################################################
// ####################################################################
// ####################################################################
// ####################################################################
// ####################################################################
// ####################################################################









// function createReactStyle (str) {
//   return React.createClass({
//     render () {
//       return <div dangerouslySetInnerHTML={{__html: `<style> ${str} </style>` }} />
//     },
//   })
// }


// annotate(InitState, new Inject(RootStyles))
// annotate(RootStyles, new Inject(ReactStore))
// function RootStyles (store) {
  // renderStyle(`
  //   background: linear-gradient(to bottom, lighten(#f5f5f5, 20%) 0%, darken(#f5f5f5, 3%) 70%,darken(#f5f5f5, 3%) 71%, lighten(#f5f5f5, 10%) 100%);
  //   border-radius: 0px;
  //   margin-bottom: 0px;
  // `).then((css) => {
//     store.get(RootElem).style = css
//     store.context.forceUpdate()
//   }, console.error.bind(console))

//   return {style: "#react-app{display:none}"}
// }

// annotate(RootElem, new TransientScope)
// annotate(RootElem, new Provide(ReactElem))
// annotate(RootElem, new Inject(ReactStore, RootStyles))
// function RootElem (store, styles) {
//   if (!store.has(RootElem)) { store.set(RootElem, styles) }

//   var RootStyles = createReactStyle(store.get(RootElem).style)
//   return (
//     <div>
//       <RootStyles key='RootStyle' />
//       <div key='RootElem'>
//         {"This is the state status:"}
//         <div key='StatusElem'> {store.context.state.status} </div>
//       </div>
//     </div>
//   )
// }
