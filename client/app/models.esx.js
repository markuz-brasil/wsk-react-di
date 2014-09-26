var defaultList = [
  {prefix: 'Mr.',       first: 'Harry',    last: 'Potter',   gender: 'm', height: 70,  weight: 140, age: 19,  has_nose: true,},
  {prefix: 'Ms.',       first: 'Hermione', last: 'Granger',  gender: 'f', height: 66,  weight: 121, age: 19,  has_nose: true,},
  {prefix: undefined,   first: 'Dobby',    last: undefined,  gender: 'm', height: 23,  weight: 20,  age: 284, has_nose: true,},
  {prefix: 'Ms.',       first: 'Luna',     last: 'Lovegood', gender: 'f', height: 68,  weight: 99,  age: 17,  has_nose: true,},
  {prefix: undefined,   first: 'Hagrid',   last: undefined,  gender: 'm', height: 108, weight: 553, age: 45,  has_nose: true,},
  {prefix: 'Dark Lord', first: 'Tom',      last: 'Riddle',   gender: 'm', height: 74,  weight: 144, age: 48,  has_nose: false,},
  {prefix: '"Moaning"', first: 'Myrtle',   last: undefined,  gender: 'f', height: 65,  weight: 0,   age: 106, has_nose: undefined,},
]


// var defaultList =  [
//   {
//     name: {prefix: 'Mr.', first: 'Harry', last: 'Potter'},
//     features: {gender: 'm', height: 70, weight: 140, age: 19, has_nose: true}
//   },
//   {
//     name: {prefix: 'Ms.', first: 'Hermione', last: 'Granger'},
//     features: {gender: 'f', height: 66, weight: 121, age: 19, has_nose: true}
//   },
//   {
//     name: {prefix: undefined, first: 'Dobby', last: undefined},
//     features: {gender: 'm', height: 23, weight: 20, age: 284, has_nose: true}
//   },
//   {
//     name: {prefix: 'Ms.', first: 'Luna', last: 'Lovegood'},
//     features: {gender: 'f', height: 68, weight: 99, age: 17, has_nose: true}
//   },
//   {
//     name: {prefix: undefined, first: 'Hagrid', last: undefined},
//     features: {gender: 'm', height: 108, weight: 553, age: 45, has_nose: true}
//   },
//   {
//     name: {prefix: 'Dark Lord', first: 'Tom', last: 'Riddle'},
//     features: {gender: 'm', height: 74, weight: 144, age: 48, has_nose: false}
//   },
//   {
//     name: {prefix: '"Moaning"', first: 'Myrtle', last: undefined},
//     features: {gender: 'f', height: 65, weight: 0, age: 106, has_nose: undefined}
//   },
//   // {
//   //   name: {prefix: '', first: '', last: ''},
//   //   features: {gender: '', height: 'average', weight: 'average', age: 'sum', has_nose: ''}
//   // },
//   // {
//   //   name: {prefix: '', first: '', last: ''},
//   //   features: {gender: '', height: 67.71, weight: 153.86, age: 538, has_nose: ''}
//   // },
// ]


export class Model {
  constructor (list) {
    list = list || defaultList

    this.store = new Map()

    list.forEach(function(item, i){
      this.store.set(item, {
        position: i,
        positionOri: i,
        visible: true,
      })

    }.bind(this))

  }
}
