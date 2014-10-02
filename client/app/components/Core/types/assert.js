// TODO(vojta):
// - extract into multiple files
// - different error types
// - simplify/humanize error messages
// - throw when invalid input (such as odd number of args into assert.argumentTypes)

// I'm sorry, bad global state... to make the API nice ;-)

import { prettyPrint, log, warn, fail } from '../utils/log'
import { isFunction, isUndefined, isObject, isArray } from '../utils/core-is'

export var TYPE_NAMESPACE = new Map()
TYPE_NAMESPACE.counter = 0

function isPrimitiveType(value, T) {

  // Checking the classical way first.
  if (value === T) { return true }
  if (typeof value === T) { return true }

  var typeToken = TYPE_NAMESPACE.get(T) || T
  if (typeToken.id === value) { return true }

  if (isFunction(T) && typeToken === T) {
    if (value instanceof T) { return true }
  }

  if (!(typeToken instanceof Type)) {
    if (isFunction(T)) { return value instanceof T }
    return false
  }

  return typeToken.assert(value, T, typeToken)
}


export function assertType (valueToken, T) {
  var value = valueToken
  if (valueToken instanceof Type) {
    // retrive the type definition if value is a type-token
    value = valueToken.id
  }

  // match and reverse match
  // and make sure T is not falsy on second time,
  // important weird logic going on here :)
  if (isPrimitiveType(value, T)) { return true }
  if (T && isPrimitiveType(T, valueToken)) { return true }

  return false;
}

// base Type class for all types.
export class Type {}

function falsy () {return false}


function cleanUp (T) {
  var token = TYPE_NAMESPACE.get(T) || T
  if (token && token.rm) {
    TYPE_NAMESPACE.delete(token.id)
  }
}

function makeTypeAssertionFn (assert) {
  return function _assert (value, T, typeToken) {
    // comparing the value's and token's types list
    var isValid = false;
    var valueToken = TYPE_NAMESPACE.get(value) || value

    if (valueToken.types) {
      var tokenTypeList = typeToken.types ? typeToken.types.slice(): []
      var valueTypeList = valueToken.types ? valueToken.types.slice(): []

      tokenTypeList.push(typeToken.id)
      valueTypeList.push(valueToken.id)

      tokenTypeList.forEach((type1) => {
        valueTypeList.forEach((type2) => {
          if (type1 === type2) { isValid = true }
        })
      })

      if (isValid) { cleanUp(T); return isValid }
    }

    // type heuristic fails, run the type's assertion againt value
    try {
      isValid = !!assert(value)
    } catch (e) { fail(e.message) }

    cleanUp(T)
    return isValid;
  }
}

// TODO: write comments
export function defineType(T, assert, ctx = {}) {

  if (isUndefined(assert)) { assert = T }

  if (isObject(assert)) {
    Object.assign(ctx, assert)
    assert = T
  }

  if (!isFunction(assert)) {
    assert = TYPE_NAMESPACE.get(T).assert || falsy
  }

  if (TYPE_NAMESPACE.has(T)) {
    var token = TYPE_NAMESPACE.get(T)
    token.assert =  makeTypeAssertionFn(assert)
    Object.assign(token, ctx)
  }
  else {
    var token = new Type()
    token.id = T
    token.assert =  makeTypeAssertionFn(assert)
    Object.assign(token, ctx)
    TYPE_NAMESPACE.set(T, token)
  }

  return token;
}

// TODO: write comments
export function defineListType(types, ctx) {
  return defineType(`[${types.map(prettyPrint).join(', ')}]`, function(values) {
    var isValid = false
    if (isArray(values) && isArray(types)) {
      values.forEach((item) => {
        types.forEach((type) => {
          if (assertType(item, type)) {
            isValid = true
          }
        })
      })
    }
    return isValid
  }, ctx)
}

// TODO: write comments
export function defineStructureType(definition, ctx) {
  var properties = Object.keys(definition);

  return defineType(`{${properties.map(prettyPrint).join(', ')}}`, function(value) {
    if (isObject(value)) {
      for (var property of properties) {
        var res = assert(value[property]).is(definition[property]);
        if (!res) {return false}
      }
    }
    return true
  }, ctx)
}

function assertStructure (v, o) {
  return assertType(v, defineStructureType(o, {rm: true}))
}

function assertList (values, types) {
  var T = defineListType(types, {rm: true})
  return assertType(values, T)
}

// asserting API sugar
export function assert(value) {
  return {
    is: function is (T) { return assertType(value, T) },
    isStructure : function isStructure (obj) { return assertStructure(value, obj)},
    isListOf: function isListOf (types) {return assertList(value, types)},
  };
}

assert.type = assertType;
assert.define = defineType;
assert.defineStructure = defineStructureType
assert.defineList = defineListType
assert.Type = Type

assert._store = TYPE_NAMESPACE
assert.delete = function deleteType (token) {assert._store.delete(token)}

assert.log = log
assert.fail = fail
assert.warn = warn


