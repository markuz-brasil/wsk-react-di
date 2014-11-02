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
  NextTick,
  RePaint,
  Actions
} from './actions'

export var AppProviders = [
  Context,                    // Boot Action
  $view, $store,              // Services
  Init$view, Init$store,      // Init Actions
  NextTick, Actions, RePaint, // EventLoop Actions
]

