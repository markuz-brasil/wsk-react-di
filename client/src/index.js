"use strict"

import {
  $view,
  Init$view
} from './view'

import {
  $store,
  Init$store
} from './store'

import {
  Context,
  FirstPaint,
  NextTick,
  RePaint,
  ActionCreator
} from './actions'

export var AppProviders = [
  Context,    //
  FirstPaint, //
  Init$view,  //
  Init$store, // Boot Stage

  $view, $store, // Services
  ActionCreator, RePaint, NextTick // EventLoop
]

