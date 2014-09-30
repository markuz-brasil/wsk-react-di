// TODO(vojta):
// - extract into multiple files
// - different error types
// - simplify/humanize error messages
// - throw when invalid input (such as odd number of args into assert.argumentTypes)

// I'm sorry, bad global state... to make the API nice ;-)

var {isFunction,
  isString,
  isUndefined,
  isNull,
  isObject,
  isArray,
  isBoolean } = require('./core-is')

var ERR_STACK = [];
export var TYPE_NAMESPACE = new Map()
TYPE_NAMESPACE.counter = 0

function fail(message) {
  ERR_STACK.push(message);
}

function formatErrors(errors, indent = '  ') {
  return errors.map((e) => {
    if (typeof e === 'string') return indent + '- ' + e;
    return formatErrors(e, indent + '  ');
  }).join('\n');
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

function falsy () {return false}

// base class for all types.
export class Type {}

export function defineType(T, assert, ctx = {}) {

  if (isUndefined(assert)) {
    assert = T
  }

  if (isObject(assert)) {
    ctx = assert
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

function cleanUp (T) {
  var token = TYPE_NAMESPACE.get(T) || T
  if (token && token.rm) {
    TYPE_NAMESPACE.delete(token.id)
  }
}

function isType(value, T, errors) {
  var typeToken = TYPE_NAMESPACE.get(T) || T
  var valueToken = TYPE_NAMESPACE.get(value) || value
  ERR_STACK = errors;

  if (typeToken.id === value) { return true }

  if (!(typeToken instanceof Type)) {
    cleanUp(T)
    if (isFunction(T)) { return value instanceof T }
    return false
  }

  var parentStack = ERR_STACK;
  var isValid;

  if (valueToken.types) {
    var tokenTypeList = typeToken.types ? typeToken.types.slice(): []
    tokenTypeList.push(typeToken.id)

    tokenTypeList.forEach((type1) => {
      valueToken.types.forEach((type2) => {
        if (type1 === type2) {
          isValid = true
        }
      })
    })

    if (isValid) {return isValid}
  }

  try {
    isValid = !!typeToken.assert(value) ;
  } catch (e) {
    fail(e.message);
    isValid = false;
  }

  ERR_STACK = parentStack;

  if (isUndefined(isValid)){
    isValid = errors.length === 0;
  }

  cleanUp(T)
  return isValid;
}


// assert a type of given value and throw if does not pass
export function checkType(actual, T) {
  var errors = [];

  if (!isType(actual, T, errors)) {
    // console.log(JSON.stringify(errors, null, '  '));
    // TODO(vojta): print "an instance of" only if T starts with uppercase.
    var msg = 'Expected an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
    if (errors.length) {
      msg += '\n' + formatErrors(errors);
    }

    throw new Error(msg);
  }
}

// asserting API
export function assert(value) {

  if (value instanceof Type) {
    value = value.id
  }

  return {
    is: function is (...tokens) {
      var allErrors = [];
      var errors;

      if (tokens.length === 0) {
        // if no type is provided, undefined it is
        tokens.push(undefined)
      }

      for (var token of tokens) {
        errors = [];

        if (isType(value, token, errors)) {
          return true;
        }

        // reverse the match :)
        if (token && isType(token, value, errors)) {
          return true;
        }


        // if no errors, merge multiple "is not instance of " into x/y/z ?
        allErrors.push(prettyPrint(value) + ' is not instance of ' + prettyPrint(token))
        if (errors.length) {
          allErrors.push(errors);
        }
      }

      ERR_STACK.push(...allErrors);
      return false;
    }
  };
}

assert.type = checkType;
assert.define = defineType;
assert.fail = fail
assert.delete = TYPE_NAMESPACE.delete.bind(TYPE_NAMESPACE)
