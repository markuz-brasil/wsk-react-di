import {Type, TypeToken} from './Type'

function createListToken (list) { return {} }

function getStructureId (struct, storage) {
  return Object.keys(struct).sort().map((field) => {
      var token = typeAssertion(struct[field], storage)
      return `${field}:${token.id || ('#'+ token.rank)}`
    }).join('-')
}

function createStructureToken (struct, storage) {
  var fields = Object.keys(struct)
  if (!fields.length || (struct instanceof TypeToken)) { return struct }

  var token = new TypeToken(getStructureId(struct, storage))

  token.assert = function assertStructure (value, base) {
    return rank(value) === rank(base)
    if (!isObject(value)) { return false }
    return base === getStructureId(value, storage)
  }

  if (storage.size) {
    // console.log('^^^', struct, token)
  }
 return token
}

function defineListType () {}
function defineStructureType () {}

export function assertStruct () {}

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

