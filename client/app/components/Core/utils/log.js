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



export function warn (msg) { console.warn(msg); return msg}
export function log (msg) { console.log(msg); return msg}
export function fail(msg) { console.error(msg); return msg}

export function prettyPrint(value) {

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

  return value.name || value.toString();
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


