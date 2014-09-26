
/** @param {React} elem */
export function preRender (elem) {
    return React.renderComponentToString(React.createClass({
    render: () => elem,
  })(null))
}

/** @param {Map<Object, Object>} store */
export function createCtxModel (store) {

    var ctxModel = {
      name: ['prefix', 'first', 'last'],
      features: ['gender', 'height', 'weight', 'age', 'has_nose'],
      data: []
    }

    store.forEach(function(state, person){
      var obj = ctxModel.data[state.position] = Object.create(null)

      obj.name = {}
      ctxModel.name.forEach(function(item){
        obj.name[item] = person[item]
      })

      obj.features = {}
      ctxModel.features.forEach(function(item){
        obj.features[item] = person[item]
      })

      obj.state = state
    })

    return ctxModel
}

// http://stackoverflow.com/questions/4340227/sort-mixed-alpha-numeric-array
var reA = /[^a-zA-Z]/g;
var reN = /[^0-9]/g;
export function sortAlphaNum(a,b) {
    var aA = a.replace(reA, "");
    var bA = b.replace(reA, "");
    if(aA === bA) {
        var aN = parseInt(a.replace(reN, ""), 10);
        var bN = parseInt(b.replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
        return aA > bA ? 1 : -1;
    }
}


export function itemSorter (col, title) {

  function _fixValue (value) {
    if (value === true) {value = 'TRUE'}
    if (value === false) {value = 'FALSE'}
    if (value === 0) {value = 0}
    if (!value && (value !== 0) && (value !== '')) {value = 'NULL'}
    return value
  }

  /**
   * @param {Object} a
   * @param {Object} b
   * @returns {1,-1,0}
   */

  return function (a, b) {

      var strA = _fixValue(a[0][col])
      var strB = _fixValue(b[0][col])

      // maybe the strA and strB are numbers, so sort numerically
      var aNum = parseInt(strA, 10)
      var bNum = parseInt(strB, 10)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return bNum - aNum
      }

      // there are other edge cases not sorted in here,
      // like strA<int|string> compared against strB<string|int>

      return sortAlphaNum(strA, strB)

    }
}

