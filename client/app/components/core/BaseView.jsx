"use strict"

import {co, React, di} from 'libs'
var { Inject, Injector, annotate, Provide } = di

function BaseCtor () { return React.createClass }
function BaseState () { return {ctx: ':: state injected'} }

function BaseElem () {
  return function BaseDiv () {
    return <div> {`... BaseView ${this.state.ctx} ...`} </div>
  }
}

annotate(BaseCtx, new Inject(BaseElem, BaseState))
export function BaseCtx (elem, state) {
  return {
    render () { return elem.call(this) },
    getInitialState () { return state }
  }
}

annotate(BaseView, new Inject(BaseCtor, BaseCtx))
export function BaseView (ctor, ctx) {
  return ctor(ctx)
}


