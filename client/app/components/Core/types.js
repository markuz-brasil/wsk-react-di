import {assert, defineType, TYPE_NAMESPACE, removeType} from './assert'
// import {test} from './types-test'

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
  // isBuffer,
} = require('./core-is')

// basic types
export var array = defineType(Array, isArray)
export var bool = defineType(Boolean, isBoolean)
export var num = defineType(Number, isNumber)
export var str = defineType(String, isString)
export var reg = defineType(RegExp, isRegExp)
export var obj = defineType(Object, isObject)
export var date = defineType(Date, isDate)
export var error = defineType(Error, isError)
export var fun = defineType(Function, isFunction)
export var sym = defineType(Symbol, isSymbol)

export var nil = defineType(null, isNull)
export var undef = defineType(undefined, isUndefined)
export var undefnil = defineType(isNullOrUndefined)
export var primitive = defineType(isPrimitive)


// TODO: write comments
export function arrayOf(...types) {
  return defineType('array of ' + types.map(prettyPrint).join('/'), function(value) {
    if (assert(value).is(Array)) {
      for (var item of value) {
        assert(item).is(...types);
      }
    }
  });
}

// TODO: write comments
export function structure(definition, rm = false) {
  var properties = Object.keys(definition);
  var ret = defineType('object with properties ' + properties.join(', '), function(value) {
    if (assert(value).is(Object)) {
      for (var property of properties) {
        assert(value[property]).is(definition[property]);
      }
    }
  }, rm)
  return ret
}


