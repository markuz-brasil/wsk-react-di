
// import {assert} from '../../Core'

assert.define(musicCategoryType)
export function musicCategoryType (value) {
  var isValid
  value.forEach((d) => {
    if (d.label && d.label.toLowerCase() === 'music') {
      isValid = true
    }
  })
  return isValid
}

assert.define(ytType)
export function ytType (base) {
  if (!assert(base.app$control).is(void 0) &&
    assert(base.category).is(musicCategoryType)) {
    return true
  }
  return false
  // console.log('^^^^', base.app$control, assert(base.category).is(musicCategoryType))

}
//   return assert.is({
//     app$control : undefined,
//     category: musicCategoryType,
//   })
// }

// assert.define(ytType, (value) => {
//   return assert(value).isStructure({
//     app$control : undefined,
//     category: musicCategoryType,
//   })
// })

