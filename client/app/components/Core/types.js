import {assert} from './assert'

export function string () {}
export function number () {}
export function bool () {}
export function undef () {}

assert.define(string, (value) => {
  return typeof value === 'string'
})

assert.define(number, (value) => {
  return typeof value === 'number'
})

assert.define(bool, (value) => {
  return typeof value === 'boolean'
})

assert.define(undef, (value) => {
  return typeof value === 'undefined'
})

