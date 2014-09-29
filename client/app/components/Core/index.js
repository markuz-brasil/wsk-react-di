import {annotate, Inject, Injector} from 'di'

export function mergeCtx (obj = {}) {
  var ctx = {}

  for (var key in obj) {
    ctx[key] = obj[key]
  }

  for (var key in this) {
    ctx[key] = this[key]
  }

  return ctx
}

export class BaseCtrl {
  constructor (obj = {}) {
    return React.createClass(mergeCtx.call(this, obj))
  }
  render() { return React.DOM.div(null, " .. BaseCtrl .. ") }
}

export class BaseState {
  constructor (ctx = {}) {
    this.ctx = ctx
  }

  getInitialState () {
    return this.ctx
  }
}

function get (url) {
  if (!url) { throw new Error('missing url') }

  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(xhr.statusText));
        }
      }
    };
    xhr.send();
  });
}

export function httpGet () { return get }

function jsonp (url) {
  if (!url) { throw new Error('missing url') }

  return new Promise(function(resolve, reject){
    var randFuncName = `jsonp${Date.now()}${Math.random()}`.replace('.','')
    var scriptTag = document.createElement('script');

    function clean () {
      delete window[randFuncName]
      document.body.removeChild(scriptTag)
    }

    function errHandler (err) {
      clean()
      reject(err)
    }

    window[randFuncName] = function jsonpCallback (json){
      clean()
      resolve(json)
    };

    scriptTag.type = "text/javascript"
    scriptTag.src = url + randFuncName
    scriptTag.onerror = errHandler
    // begin jsonp call by appending a script tag into the body
    document.body.appendChild(scriptTag);
  })
}

export function httpJsonp () { return jsonp }

export class Http {
  constructor (get, jsonp) {
    this.get = get
    this.jsonp = jsonp
  }
}
annotate(Http, new Inject(httpGet, httpJsonp))

export var http = new Injector([]).get(Http)

export {types} from './types'
export {assert} from './assert'
