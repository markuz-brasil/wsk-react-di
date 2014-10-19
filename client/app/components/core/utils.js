"use strict"


export function mergeObject (...objs) {
  var target = objs[1]
  for (var k0 in objs) {
    for (var k1 in objs[k0]) {
      target[k1] = objs[k0][k1]
    }
  }
  return target
}

export function getNonEnumProps (obj) {
  var target = {}
   Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).forEach((prop) => {
    if (!target[prop]) {
      target[prop] = obj[prop]
    }
  })
  return target
}


export function fetchJsonp () {
  var t0 = new Date
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`done doing some async op in (${new Date - t0}ms)`)
    }, Math.random()*1000 |0)
  })
}
