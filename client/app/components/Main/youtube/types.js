
import {assert} from '../../Core'

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
export function ytType (value) {
  return assert(value).isStructure({
    app$control : undefined,
    category: musicCategoryType,
  })
}

// assert.define(ytType, (value) => {
//   return assert(value).isStructure({
//     app$control : undefined,
//     category: musicCategoryType,
//   })
// })

