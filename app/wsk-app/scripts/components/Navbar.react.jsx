// import {NavBar} from './Body.react';
var cx = React.addons.classSet

class _Navbar {
  getInitialState () {
    return {
      menuClicked: false,
      opened: false

    }
  }

  // handleClick(evt){
  //   this.state.menuClicked = !this.state.menuClicked
  //   this.state.opened = true
  //   this.props.menuClicked()
  //   console.log('navbar', this.state)
  // }

  render() {
    var navClass = cx({
      'navdrawer-container': true,
      'promote-layer': true,
      'open': this.props.parent.state.menuClicked,
      'opened': this.props.parent.state.menuOpened,
    })

    return (
      <nav className={navClass} onClick={this.props.parent.closeMenu}>
        <h4>Navigation</h4>
        <ul>
          <li><a href="#React">React</a></li>
          <li><a href="#get-started">Get Started</a></li>
          <li><a href="styleguide/index.html">Style Guide</a></li>
        </ul>
      </nav>
    );
  }
}

export var Navbar = React.createClass(_Navbar.prototype);
