"use strict"
import { less } from 'runtime'

export function renderStyle (str) {
  return new Promise((resolve, reject) => {
    setImmediate(() =>{
      less.render(`#react-app { ${str} }`, {compress: true}, function (err, css) {
        if (err) { return reject(err) }
        resolve(css)
      })
    })
  })
}

export function mergeObjs (...objs) {
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

var counter = 0
export function fetchJsonp () {
  var t0 = new Date

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      counter++
      resolve(`done (${counter}) doing some async op in (${new Date - t0}ms)`)
    // }, Math.random()*100 |0)
    }, 2000)
  })
}
