
"use strict"
import {co, React, di} from 'libs'
import {BaseView, BaseCtx, fetchJsonp, BaseCtor} from 'core'

var {
  Inject, InjectPromise, InjectLazy,
  Injector, annotate, Provide,
  ProvidePromise } = di

export function Main (...args) {
  return new Injector([]).get(MainWrap)(...args)
}

annotate(MainWrap, new InjectLazy(MainCtx))
function MainWrap (lazyCtx) {
  return React.createClass(lazyCtx())
}

annotate(MainCtx,new InjectLazy(MainElem, MainState))
function MainCtx (lazyElem, lazyState) {
  return {
    render () { return lazyElem()(this) },
    getInitialState () { return lazyState()(this) }
  }
}

function MainState () {
  var t0 = new Date

  return function MainState (self) {
    return {ctx: `state lazy injected (${new Date - t0}ms)`}
  }
}

function MainElem () {
  var t0 = new Date
  return function MainElem (self) {
    return <div> {`... Main :: ${self.state.ctx} :: (${new Date - t0}ms) ...`} </div>
  }
}

/*
annotate(MainCtx, new ProvidePromise(BaseCtx))
annotate(MainCtx, new Inject(MainElem, MainState))
export function MainCtx (elem, state) {
  console.log('MainCtx: ^^^', elem, '^^^', state)
  return {
    render () { return elem.call(this) },
    getInitialState () { return state() }
  }
}

  // co(function* (){
  //   console.log(yield fetchJsonp())
  // })()


export var Main = new Injector([MainCtx]).get(BaseView)
export var MainLazy = new Injector([]).get(MainWrap)
console.log(MainLazy)
console.log('&&&', inj.get(BaseView))

annotate(MainCtx, new Provide(BaseCtx))
annotate(MainCtx,new Inject(MainElem, MainState))
function MainCtx (elem, state) {
  console.log('MainCtx:', elem, '###', state)
  return {
    render () { return elem(this) },
    getInitialState () { return state(this) }
  }
}


*/


