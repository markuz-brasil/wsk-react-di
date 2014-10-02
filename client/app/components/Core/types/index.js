import {assert} from './assert'

import {
  isArray,
  isBoolean,
  isNumber,
  isString,
  isRegExp,
  isObject,
  isDate,
  isError,
  isFunction,

  isNull,
  isUndefined,
  isSymbol,
} from '../utils/core-is'

// basic types
assert.define(Array, isArray)
assert.define(Boolean, isBoolean)
assert.define(Number, isNumber)
assert.define(String, isString)
assert.define(RegExp, isRegExp)
assert.define(Object, isObject)
assert.define(Date, isDate)
assert.define(Error, isError)
assert.define(Function, isFunction)

assert.define(Symbol, isSymbol)

assert.define(null, isNull)
assert.define(undefined, isUndefined)


// export {assert}

// type API sugar
export var types = {}

//
types.Type = assert.Type
types.assert = assert

// console.log('***', types)

