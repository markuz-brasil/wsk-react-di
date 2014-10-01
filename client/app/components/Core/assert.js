// TODO(vojta):
// - extract into multiple files
// - different error types
// - simplify/humanize error messages
// - throw when invalid input (such as odd number of args into assert.argumentTypes)

// I'm sorry, bad global state... to make the API nice ;-)

var {
  isFunction,
  isString,
  isUndefined,
  isNull,
  isObject,
  isArray,
  isBoolean } = require('./core-is')

var ERR_STACK = [];
export var TYPE_NAMESPACE = new Map()
TYPE_NAMESPACE.counter = 0

// base Type class for all types.
export class Type {}
export function falsy () {return false}

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
    token.assert = assert
    Object.assign(token, ctx)
  }
  else {
    var token = new Type()
    token.id = T
    token.assert = assert
    Object.assign(token, ctx)
    TYPE_NAMESPACE.set(T, token)
  }

  return token;
}

// TODO: write comments
export function defineListType(types) {
  return defineType('array of ' + types.map(prettyPrint).join('/'), function(values) {
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
  })
}

// TODO: write comments
export function defineStructureType(definition, ctx) {
  var properties = Object.keys(definition);
  return defineType('object with properties ' + properties.join(', '), function(value) {
    if (isObject(value)) {
      for (var property of properties) {
        var res = assert(value[property]).is(definition[property]);
        if (!res) {return false}
      }
    }
    return true
  }, ctx)
}

function cleanUp (T) {
  var token = TYPE_NAMESPACE.get(T) || T
  if (token && token.rm) {
    TYPE_NAMESPACE.delete(token.id)
  }
}

function isType(value, T) {

  // Checking the classical way first.
  if (value === T) { return true }
  if (typeof value === T) { return true }

  var typeToken = TYPE_NAMESPACE.get(T) || T
  if (typeToken.id === value) { return true }

  if (!(typeToken instanceof Type)) {
    if (isFunction(T)) { return value instanceof T }
    return false
  }

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
    isValid = !!typeToken.assert(value)
  } catch (e) { fail(e.message) }

  cleanUp(T)
  return isValid;
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
  if (isType(value, T)) { return true }
  if (T && isType(T, valueToken)) { return true }

  return false;
}

function assertStructure (v, o) {
  return assertType(v, defineStructureType(o, {rm: true}))
}

function assertList (values, types) {
  var T = defineListType(types)
  return assertType(values, T)
}

// asserting API sugar
export function assert(value) {
  return {
    is: function is (T) { return assertType(value, T) },
    isStructure : function isStructure (o) { return assertStructure(value, o)},
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

function warn (...msg) { console.warn(...msg) }
function log (...msg) { console.log(...msg) }
function fail(message) {
  ERR_STACK.push(message);
  console.error(message)
}

function prettyPrint(value) {

  if (isUndefined(value)) {
    return 'undefined';
  }

  if (isString(value)) {
    return '"' + value + '"';
  }

  if (isBoolean(value)) {
    return value.toString();
  }

  if (isNull(value)) {
    return 'null';
  }

  if (isObject(value)) {

    if (value.map) {
      return '[' + value.map(prettyPrint).join(', ') + ']';
    }

    var properties = Object.keys(value);
    return '{' + properties.map((p) => p + ': ' + prettyPrint(value[p])).join(', ') + '}';
  }

  var ctx = TYPE_NAMESPACE.get(value) || {}

  return ctx.name || value.name || value.toString();
}

// function formatErrors(errors, indent = '  ') {
//   return errors.map((e) => {
//     if (typeof e === 'string') return indent + '- ' + e;
//     return formatErrors(e, indent + '  ');
//   }).join('\n');
// }

// assert a type of given value and throw if does not pass
// function log(actual, T) {
//   var errors = [];

//   if (!isType(actual, T, errors)) {
//     // console.log(JSON.stringify(errors, null, '  '));
//     // TODO(vojta): print "an instance of" only if T starts with uppercase.
//     var msg = 'Expected an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
//     if (errors.length) {
//       msg += '\n' + formatErrors(errors);
//     }

//     throw new Error(msg);
//   }
// }


