import {Header} from './components/Header.react';
import {Main} from './components/Main.react';
import {Navbar} from './components/Navbar.react';
// import {Injector} from 'di'
var cx = React.addons.classSet

class _App {
  getInitialState () {
    return {
      menuClicked: false,
      menuOpened: false,
    }
  }

  toggleMenu () {
    this.state.menuClicked = !this.state.menuClicked
    this.state.menuOpened = true
    this.forceUpdate()
  }

  closeMenu (event) {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      this.state.menuClicked = false
    }
    this.forceUpdate()
  }

  render() {
    var wrapperClass = cx({
      'open': this.state.menuClicked,
    })

    return (
      <div className={wrapperClass} >
        <Header parent={this}/>
        <Navbar parent={this}/>
        <Main parent={this}/>
      </div>
    );
  }
}

export var App = React.createClass(_App.prototype);

var renderApp = () => React.renderComponent(
    <App />, document.getElementById('react-app')
);

renderApp();
