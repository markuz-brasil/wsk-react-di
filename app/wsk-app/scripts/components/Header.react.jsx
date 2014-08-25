console.log('--- Header ---')
var cx = React.addons.classSet
class _Header {

  render() {
    var headerClass = cx({
      'app-bar': true,
      'promote-layer': true,
      'open': this.props.parent.state.menuClicked,
    })

    return (
      <header className={headerClass}>
        <div className="app-bar-container">
          <button className="menu" onClick={this.props.parent.toggleMenu}>
            <img src="images/hamburger.svg" alt="Menu"/>
          </button>
          <h1 className="logo">Web Starter Kit</h1>
          <section className="app-bar-actions">
          {/** put app icons here */}
          </section>
        </div>
      </header>
    );
  }
}

export var Header = React.createClass(_Header.prototype);
