"use strict"

import { di } from 'libs'

var {
  annotate,
  Inject,
  Injector,
  Provide,
  TransientScope
} = di

import * as flux from './annotations'


annotate(Dispatcher, new Provide(flux.Dispatcher))
export function Dispatcher () { console.log('default dis'); return new Injector([]) }
