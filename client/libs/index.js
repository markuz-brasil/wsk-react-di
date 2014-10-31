
var {di, assert } = window.BundleNamespace.coreLibs
import * as co from './co'

export {co, di, assert}

function handler (next) {
  return (err, value) => {
    if (err) return console.error(err, err.message, err.stack)

    try { return next(null, value) }
    catch (err) { console.error(err, err.message, err.stack) }
  }
}

export function c0 (fn) {
  return function c0 (...args) {
    if (args.length === 0) return co(fn)()
    var next = args.pop()

    if (args.length === 0) return co(fn)(handler(next))
    if (typeof next !== 'function') return co(fn)(next)

    args.push(handler(next))
    co(fn)(...args)
  }
}

// di.InjectSync = di.Inject
// di.ProvideSync = di.Provide
// di.InjectorSync = di.Injector

// class InjectLazySync extends di.InjectLazy {
//   constructor(...args) {
//     super(...args)
//     this.async = false
//     console.log('InjectLazySync', args)
//   }
// }

// class InjectAsync extends di.Inject {
//   constructor (...args) {
//     console.log('InjectAsync', args)
//     super(...args)
//     this.async = true
//   }
// }

// class InjectLazyAsync extends di.InjectLazy {
//   constructor (...args) {
//     super(...args)
//     this.async = true
//     console.log('InjectLazyAsync', args, this)

//   }
// }

// class ProvideAsync extends di.Provide {
//   constructor (...args) {
//     super(...args)
//     this.async = true
//     console.log('ProvideAsync', args, this)

//   }
// }

// class InjectorAsync extends di.Injector {
//   constructor (...args) {
//     this.store = this.store || new Map
//     this.store.set(args)
//     super(...args)
//     this.async = true
//     // console.log('InjectorAsync', args, this.get)

//   }
//   get (...args) {
//     var instance = super(...args)
//     if (!this.async) return instance
//     // console.log(di.Injector.prototype.get)
//     return instance
//   }
// }

// di.InjectLazySync = InjectLazySync

// di.InjectAsync = InjectAsync
// di.InjectLazyAsync = InjectLazyAsync
// di.ProvideAsync = ProvideAsync
// di.InjectorAsync = InjectorAsync

// export {
//   Injector,
//   annotate,
//   Inject,
//   InjectLazy,
//   InjectPromise,
//   Provide,
//   ProvidePromise,
//   SuperConstructor,
//   TransientScope
// } from 'di'
