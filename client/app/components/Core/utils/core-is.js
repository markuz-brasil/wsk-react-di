// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
export function isArray(ar) {
  return Array.isArray(ar);
}

export function isBoolean(arg) {
  return typeof arg === 'boolean';
}

export function isNull(arg) {
  return arg === null;
}

export function isNullOrUndefined(arg) {
  return arg == null;
}

export function isNumber(arg) {
  return typeof arg === 'number';
}

export function isString(arg) {
  return typeof arg === 'string';
}

export function isSymbol(arg) {
  return typeof arg === 'symbol';
}

export function isUndefined(arg) {
  return arg === void 0;
}

export function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

export function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

export function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

export function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}

export function isFunction(arg) {
  return typeof arg === 'function';
}

export function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}

// export function isBuffer(arg) {
//   return Buffer.isBuffer(arg);
// }

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
