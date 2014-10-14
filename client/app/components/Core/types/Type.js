
export function Type (storage) {
  if (this instanceof Type) { return Type(storage) }
  var ctx = {storage: (storage instanceof Map) ? storage : new Map}

  return {
    assert: typeAssertion.bind(ctx),
    define: defineType.bind(ctx),
    storage: ctx.storage,
  }
}

var {assert, define, storage} = new Type
export {assert, define, storage}

export class TypeToken {
  constructor (type, assertFunc, equalFunc) {
    if (!(this instanceof TypeToken)) { return new TypeToken(type, assertFunc, equalFunc) }

    this.rank = rank(type)
    this.base = type

    if (isFunction(type) && !isFunction(assertFunc)) { assertFunc = type }

    this.assert = isFunction(assertFunc) ? assertFunc : defaultAssert
    this.equal = isFunction(equalFunc) ? equalFunc : defaultEqual

    this.is = defaultIs.bind(this)
    this.isEqual = defaultIsEqual.bind(this)
  }
}

export function rank (value) {
  // minimal set of assertions to detect all native ES5 types

  return [
    (typeof value === 'boolean')|0,
    (typeof value === 'number')|0,
    (typeof value === 'string')|0,
    (typeof value === 'function')|0,

    (value === void 0)|0,
    (value === null)|0,
    (value === value)|0,  // 0 if NaN

    (value instanceof Array)|0,
    (value instanceof RegExp)|0,
    (value instanceof Date)|0,
    (value instanceof Error)|0,

  ].join('')
}

function isFunction (item) { return typeof item === 'function' }

var typeIdCounter = 0
function createTypeId () { return (typeIdCounter++).toString(36) }

function defineType (type, assertFunc = defaultAssert, equalFunc = defaultEqual, token) {
  if (!(this.storage instanceof Map)) { throw new Error('storage needs to be an instanceof Map') }

  if (type instanceof TypeToken) { return type }
  if (this.storage.has(type)) { return this.storage.get(type)}

  token = token || new TypeToken(type, assertFunc, equalFunc, this.storage)
  token.id = createTypeId()

  this.storage.set(type, Object.freeze(token))
  return token
}

function typeAssertion (base) {
  if ((this.storage instanceof Map) && this.storage.has(base)) { return this.storage.get(base) }
  return new TypeToken(base, defaultAssert, defaultEqual)
}

function defaultIs (value) { return this.assert(value, this.base) }
function defaultIsEqual (value) { return this.equal(value, this.base) }
function defaultEqual (value, base) { return value === base }

function defaultAssert (value, base) {
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

