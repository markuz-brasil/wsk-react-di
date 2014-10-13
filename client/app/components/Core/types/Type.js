import {Token, assert, rank} from './assert2'

var isArray = assert([]).is
var isObject = assert({}).is
var isFunction = assert(()=>{}).is
var isString = assert('').is
var assign = Object.assign.bind(Object)

export function Type (storage) {
  if (this instanceof Type) { return Type(storage) }
  var ctx = {storage: storage instanceof Map ? storage : new Map}

  return {
    assert: typeAssertion.bind(ctx),
    define: defineType.bind(ctx)
  }
}

export class TypeToken extends Token {
  constructor (type, assertFunc, equalFunc) {

    if (!(this instanceof TypeToken)) { return new TypeToken(type, assertFunc, equalFunc) }

    if (isString(type)) {
      assign(this, assert(type))
      this.id = createTypeId('str')
      if (isFunction(assertFunc)) { this.assert = assertFunc }
    }

    else if (isFunction(type)) {
      assign(this, assert(type))
      this.id = createTypeId('func')
      if (isFunction(assertFunc)) { this.assert = assertFunc }
      else { this.assert = type }
    }

    else if (isArray(type)) {
      assign(this, createListToken(type))
      this.id = createTypeId('list')
      if (isFunction(assertFunc)) { this.assert = assertFunc }
    }

    else if (isObject(type) && !(type instanceof TypeToken)) {
      assign(this, createStructToken(type))
      this.id = createTypeId('struct')
      if (isFunction(assertFunc)) { this.assert = assertFunc }
    }

    else {
      assign(this, assert(type))
      this.id = createTypeId('es5')
      if (isFunction(assertFunc)) { this.assert = assertFunc }
    }

    if (!isFunction(equalFunc)) { this.equal = equalCheck }

    this.is = defaultIs.bind(this)
    this.isEqual = defaultIsEqual.bind(this)
  }
}

function defineType (type, assertFunc = typeCheck, equalFunc = equalCheck, token) {
  if (this.storage instanceof Map) {
    if (this.storage.has(type)) { return this.storage.get(type)}
    token = token || new TypeToken(type, assertFunc, equalFunc)
    this.storage.set(type, token)
  }
  return token
}

function typeAssertion (base) {
  if (this.storage.has(base)) { return this.storage.get(base) }
  return new TypeToken(base, typeCheck, equalCheck)
}

function defaultIs (value) {
  return this.assert(this.base, value)
}

function defaultIsEqual (value) {
  return this.equal(this.base, value)
}

function equalCheck (base, value) {
  return base === value
}

function typeCheck (base, value) {
  var isValid

  if (base instanceof TypeToken) {base = base.base}
  if (value instanceof TypeToken) {value = value.base}
  if (base === value) { return true }

  if (isFunction(value)) {
    isValid = value(base)
    if (isValid === true) { return true }
    if (isValid === false) { return false }
  }

  if (isFunction(base)) {
    isValid = base(value)
    if (isValid === true) { return true }
    if (isValid === false) { return false }
  }

  return rank(base) === rank(value)
}

var counter = { func : -1, str: -1, type: -1, list: -1, struct: -1, es5: -1, all: -1, }

function createTypeId (prefix = 'type') {
  counter[prefix]++
  counter.all++
  return `${prefix}-${counter[prefix].toString(36)}:${counter.all.toString(36)}`
}

function createListToken (list) {
  // TODO: implement list of
  return assert(list)
}

function createStructToken (struct) {
  // TODO: implement structure
  return assert(struct)
}


function defineListType () {}
function defineStructureType () {}


// export var types = [
//   Array, Boolean, Number, String, RegExp, Object, Date, Error, Function, Map, Set,
//   new Array, new Boolean, new Number, new String, new RegExp, new Object, new Date, new Error, new Function, new Map, new Set,
//   void 0, null, NaN, -1, 0, 1, Math.E, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY,
// ]




// function makeTypes () {

//  // var
//  // console.log('^^^^', !!Map)
// // var Set = Set || function SetPlaceHolder (){}
// // var Symbol = Symbol || function SymbolPlaceHolder (){}


//   // TODO: explain why 2 equal lists !
//   var typesList0 = [
//     Array, Boolean, Number, String, RegExp, Object, Date, Error, Function, Map, Set,
//     void 0, null, NaN, 0, 1, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY,
//   ]

//   var typesList1 = [
//     Array, Boolean, Number, String, RegExp, Object, Date, Error, Function, Map, Set,
//     void 0, null, NaN, 0, 1, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY,
//   ]


// export class NonPrimitive {}

// export class Token {
//   constructor (base, assert, equal) {
//     this.score = score(base)
//     this.base = base
//     this.assert = assert
//     this.equal = equal
//   }

//   is (value) {
//     return this.assert(this.base, value)
//   }

//   isEqual (value) {
//     return this.equal(this.base, value)
//   }
// }

// export function assert (value) {
//   return new Token(value, scoreCheck, defaultIsEqual)
// }

// export function score (value) {
//   // testing for Object.create(null) evil here.
//   // all types that can't be converted to a primitive type are assign
//   // this NonPrimitive placeholder type to them.
//   try { value|0 }
//   catch (e) { value = new NonPrimitive }

//   return parseInt([
//     (typeof value === 'boolean')|0,
//     (typeof value === 'number')|0,
//     (typeof value === 'string')|0,
//     (typeof value === 'symbol')|0,
//     (typeof value === 'function')|0,

//     (value === ((value | 0) + 0))|0,  // false if float
//     (value === value)|0,              // false if NaN
//     (value == value)|0,               // false if NaN
//     (value === -1)|0,
//     (value === 0)|0,
//     (value == 0)|0,
//     (value === 1)|0,
//     (value == 1)|0,
//     (value === Number.POSITIVE_INFINITY)|0,
//     (value === Number.NEGATIVE_INFINITY)|0,

//     (value === void 0)|0,
//     (value == void 0)|0,
//     (value === null)|0,
//     (value == null)|0,

//     (value === Array)|0,
//     (value === Boolean)|0,
//     (value === Number)|0,
//     (value === String)|0,
//     (value === RegExp)|0,
//     (value === Object)|0,
//     (value === Date)|0,
//     (value === Error)|0,
//     (value === Function)|0,
//     (value === Symbol)|0,
//     (value === Map)|0,
//     (value === Set)|0,
//     (value === NonPrimitive)|0,

//     (value instanceof Array)|0,
//     (value instanceof Boolean)|0,
//     (value instanceof Number)|0,
//     (value instanceof String)|0,
//     (value instanceof RegExp)|0,
//     (value instanceof Object)|0,
//     (value instanceof Date)|0,
//     (value instanceof Error)|0,
//     (value instanceof Function)|0,
//     (value instanceof Symbol)|0,
//     (value instanceof Map)|0,
//     (value instanceof Set)|0,
//     (value instanceof NonPrimitive)|0,

//     (typeof value === 'object' && value !== null)|0,   // object
//     (Object.prototype.toString.call(value) === '[object RegExp]')|0,
//     (Object.prototype.toString.call(value) === '[object Date]')|0,
//     (Object.prototype.toString.call(value) === '[object Error]')|0,

//   ].join(''), 2).toString(36)
// }

