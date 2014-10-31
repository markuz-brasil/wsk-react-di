"use strict"

import { di } from 'libs'
import * as flux from './annotations'

var { annotate, Inject, Injector, Provide } = di

annotate(Dispatcher, new Provide(flux.Dispatcher))
export function Dispatcher () { return new Injector([]) }
