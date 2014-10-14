import {Token, assert, rank} from './assert2'

var isArray = assert([]).is
var isObject = assert({}).is
var isFunction = assert(()=>{}).is
var isString = assert('').is

export function Type (storage) {
  if (this instanceof Type) { return Type(storage) }
  var ctx = {storage: (storage instanceof Map) ? storage : new Map}

  return {
    assert: typeAssertion.bind(ctx),
    define: defineType.bind(ctx),
    storage: ctx.storage,
  }
}

export class TypeToken extends Token {
  constructor (type, assertFunc, equalFunc) {
    if (!(this instanceof TypeToken)) { return new TypeToken(type, assertFunc, equalFunc) }

    this.rank = rank(type)
    this.base = type

    if (isFunction(type) && !isFunction(assertFunc)) { assertFunc = type }

    this.assert = isFunction(assertFunc) ? assertFunc : defaultTypeCheck
    this.equal = isFunction(equalFunc) ? equalFunc : defaultEqualCheck

    this.is = defaultIs.bind(this)
    this.isEqual = defaultIsEqual.bind(this)
  }
}

var typeIdCounter = 0
function createTypeId () { return (typeIdCounter++).toString(36) }

function defineType (type, assertFunc = defaultTypeCheck, equalFunc = defaultEqualCheck, token) {
  if (!(this.storage instanceof Map)) { throw new Error('storage needs to be an instanceof Map') }

  if (type instanceof TypeToken) { return type }
  if (this.storage.has(type)) { return this.storage.get(type)}

  token = token || new TypeToken(type, assertFunc, equalFunc, this.storage)
  token.id = createTypeId()

  this.storage.set(type, Object.freeze(token))
  return token
}

function typeAssertion (base, storage) {
  storage = storage || this.storage
  if ((this.storage instanceof Map) && storage.has(base)) { return storage.get(base) }
  return new TypeToken(base, defaultTypeCheck, defaultEqualCheck)
}

function defaultTypeCheck (value, base) {
  var isValid, baseIs, valueIs

  if (base instanceof TypeToken) { baseIs = base.is; base = base.base }
  if (value instanceof TypeToken) { valueIs = value.is; value = value.base }
  if (base === value) { return true }

  if (isFunction(baseIs)) {
    isValid = baseIs(value)
    if (isValid === true) { return true }
    if (isValid === false) { return false }
  }

  if (isFunction(base)) {
    isValid = base(value)
    if (isValid === true) { return true }
    if (isValid === false) { return false }
  }

  if (isFunction(valueIs)) {
    isValid = valueIs(base)
    if (isValid === true) { return true }
    if (isValid === false) { return false }
  }

  if (isFunction(value)) {
    isValid = value(base)
    if (isValid === true) { return true }
    if (isValid === false) { return false }
  }

  return rank(base) === rank(value)
}

function defaultIs (value) { return this.assert(value, this.base) }
function defaultIsEqual (value) { return this.equal(value, this.base) }
function defaultEqualCheck (value, base) { return value === base }



