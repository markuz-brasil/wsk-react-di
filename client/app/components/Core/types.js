import {assert} from './assert'

var {
  isArray,
  isBoolean,
  isNull,
  isUndefined,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isRegExp,
  isObject,
  isDate,
  isError,
  isFunction,
  isPrimitive,
} = require('./core-is')

// basic types
export var array = assert.define(Array, isArray)
export var bool = assert.define(Boolean, isBoolean)
export var num = assert.define(Number, isNumber)
export var str = assert.define(String, isString)
export var reg = assert.define(RegExp, isRegExp)
export var obj = assert.define(Object, isObject)
export var date = assert.define(Date, isDate)
export var error = assert.define(Error, isError)
export var fun = assert.define(Function, isFunction)
export var sym = assert.define(Symbol, isSymbol)

export var nil = assert.define(null, isNull)
export var undef = assert.define(undefined, isUndefined)
export var undefnil = assert.define(isNullOrUndefined, {types: [null, undefined]})
export var primitive = assert.define(isPrimitive, {
  types: [Boolean, Number, String, Symbol, undefined,],
})


