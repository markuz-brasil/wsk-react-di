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

export function httpGet () {
  return function get (url) {
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
}

export function httpJsonp () {
  return function jsonp (url) {
    if (!url) { throw new Error('missing url') }

    return new Promise(function(resolve, reject){
      var generatedFunction = `jsonp${Date.now()}${Math.random()}`.replace('.','')

      window[generatedFunction] = function(json){
        resolve(json)
        delete window[generatedFunction]
        document.body.removeChild(script)
      };

      var script = document.createElement('script');
      script.type = "text/javascript"
      script.src = url + generatedFunction
      script.onerror = reject
      document.body.appendChild(script);
    })
  }
}

export class Http {
  constructor (get, jsonp) {
    this.get = get
    this.jsonp = jsonp
  }
}
annotate(Http, new Inject(httpGet, httpJsonp))

export var http = new Injector([]).get(Http)


