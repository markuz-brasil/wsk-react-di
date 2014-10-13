
export class Token {
  constructor (base, assert, equal) {
    this.rank = rank(base)
    this.base = base
    this.assert = assert
    this.equal = equal

    this.is = this.is.bind(this)
    this.isEqual = this.isEqual.bind(this)
  }

  is (value) { return this.assert(this.base, value) }
  isEqual (value) { return this.equal(this.base, value) }
}

export function assert (base) {
  return new Token(base, rankCheck, equalCheck)
}

export function rank (value) {
  // minimal assertions to detect all native ES5 types

  return [
    (typeof value === 'boolean')|0,
    (typeof value === 'number')|0,
    (typeof value === 'string')|0,

    (value === void 0)|0,
    (value === null)|0,
    (value === value)|0,  // 0 if NaN

    (value instanceof Array)|0,
    (value instanceof RegExp)|0,
    (value instanceof Date)|0,
    (value instanceof Error)|0,
    (value instanceof Function)|0,

  ].join('')|0
}

export function rankCheck (val0, val1) { return !!(rank(val0) === rank(val1)) }
export function equalCheck (val0, val1) { return !!(val0 === val1) }
