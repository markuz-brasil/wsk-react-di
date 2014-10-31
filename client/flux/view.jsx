"use strict"

import { React, less } from 'runtime'
import { c0, di } from 'libs'

var {
  annotate,
  Inject,
  Provide,
  TransientScope
} = di

// There is a bug on 6to5. It doesnt handle exporting generators well.
// So just defining all exports at the top instead
export {
  // ReactLess,
  View
}



// view

var _style = { background: '#cb9a76' }
var _view = {init: renderInit}

function * renderInit () {
  var t0 = new Date

  console.log('2: render')
  yield (next) => setTimeout(next, Math.random()*10|0)
  console.log('2: done render', new Date - t0)

  _view.style = _style
  return {
    render () {
      return <div style={ this.state.style }> { this.state.msg } </div>
    }
  }

}

function View () {
  return _view
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
