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
  isBoolean } = require('./core-is')

var ERR_STACK = [];
export var TYPE_NAMESPACE = new Map()

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

function errorMsg (msg) {
    throw new Error(msg)
}

function falsy () {return false}

export function defineType(T, assert, once = false) {

  if (isUndefined(assert)) {
    assert = T
  }

  if (!isFunction(assert)) {
    assert = falsy
  }

  var token = {}
  token.type = T
  token.assert = assert

  TYPE_NAMESPACE.set(T, token)
  return T;
}

function undef () {}
defineType(undef, isUndefined)

function nil () {}
defineType(nil, isNull)

function cleanUp (T) {
  var ctx = TYPE_NAMESPACE.get(T)
  if (ctx && ctx.rm) {
    TYPE_NAMESPACE.delete(T)
  }
}

function isType(value, T, errors) {

  if (isUndefined(T)) {
    T = undef
  }

  if (isNull(T)) {
    T = nil
  }

  var ctx = TYPE_NAMESPACE.get(T)
  if (ctx && typeof ctx.assert === 'function') {
    var parentStack = ERR_STACK;
    var isValid;
    ERR_STACK = errors;
    try {
      isValid = ctx.assert(value) ;
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

  cleanUp(T)
  return value instanceof T;
}


// assert a type of given value and throw if does not pass
export function checkType(actual, T) {
  var errors = [];
  // ERR_STACK = [];

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
  return {
    is: function is(...tokens) {
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


