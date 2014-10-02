
Symbol = Symbol || function(){}
Map = Map || function(){}
Set = Set || function(){}

export var types = [
  Array, Boolean, Number, String, RegExp, Object, Date, Error, Function, Map, Set,
  new Array, new Boolean, new Number, new String, new RegExp, new Object, new Date, new Error, new Function, new Map, new Set,
  void 0, null, NaN, -1, 0, 1, 2, Math.E, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY,
]

export class NonPrimitive {}

export class Token {
  constructor (base, assert, equal) {
    this.score = score(base)
    this.base = base
    this.assert = assert
    this.equal = equal
  }

  is (value) {
    return this.assert(this.base, value)
  }

  isEqual (value) {
    return this.equal(this.base, value)
  }
}

export function assert (value) {
  return new Token(value, scoreCheck, equalCheck)
}

export function score (value) {
  // testing for Object.create(null) evil here.
  // all types that can't be converted to a primitive type are assign
  // this NonPrimitive placeholder type to them.
  try { value|0 }
  catch (e) { value = new NonPrimitive }

  return parseInt([
    (typeof value === 'boolean')|0,
    (typeof value === 'number')|0,
    (typeof value === 'string')|0,
    (typeof value === 'symbol')|0,
    (typeof value === 'function')|0,

    (value === ((value | 0) + 0))|0,  // false if float
    (value === value)|0,              // false if NaN
    (value == value)|0,               // false if NaN
    (value === -1)|0,
    (value === 0)|0,
    (value == 0)|0,
    (value === 1)|0,
    (value == 1)|0,
    (value === Number.POSITIVE_INFINITY)|0,
    (value === Number.NEGATIVE_INFINITY)|0,

    (value === void 0)|0,
    (value == void 0)|0,
    (value === null)|0,
    (value == null)|0,

    (value === Array)|0,
    (value === Boolean)|0,
    (value === Number)|0,
    (value === String)|0,
    (value === RegExp)|0,
    (value === Object)|0,
    (value === Date)|0,
    (value === Error)|0,
    (value === Function)|0,
    (value === Symbol)|0,
    (value === Map)|0,
    (value === Set)|0,
    (value === NonPrimitive)|0,

    (value instanceof Array)|0,
    (value instanceof Boolean)|0,
    (value instanceof Number)|0,
    (value instanceof String)|0,
    (value instanceof RegExp)|0,
    (value instanceof Object)|0,
    (value instanceof Date)|0,
    (value instanceof Error)|0,
    (value instanceof Function)|0,
    (value instanceof Symbol)|0,
    (value instanceof Map)|0,
    (value instanceof Set)|0,
    (value instanceof NonPrimitive)|0,

    (typeof value === 'object' && value !== null)|0,   // object
    (Object.prototype.toString.call(value) === '[object RegExp]')|0,
    (Object.prototype.toString.call(value) === '[object Date]')|0,
    (Object.prototype.toString.call(value) === '[object Error]')|0,

  ].join(''), 2).toString(36)
}

function scoreCheck (val0, val1) {
  return !!(score(val0) === score(val1))
}

function equalCheck (val0, val1) {
  return !!(val0 === val1)
}
