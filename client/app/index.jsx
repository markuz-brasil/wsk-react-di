import {App} from './components/Main'
require('setimmediate')

React.initializeTouchEvents(true)
React.renderComponent(<App />, document.getElementById('react-app'));


// function* idMaker(){
//     var index = 0;
//     while(true)
//         yield index++;
// }

// var gen = idMaker();

// console.log(gen.next().value); // 0
// console.log(gen.next().value); // 1
// console.log(gen.next().value); // 2

