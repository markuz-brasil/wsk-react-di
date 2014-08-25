// import {NavBar} from './Body.react';

class _Main {
    handleClick(evt){
      // this.setState({text: evt})
      // console.log('main', evt)
      // if (this.props)
    }
    render() {
        return (
          <main onClick={this.handleClick}>
            <h1 id="hello">Hello!</h1>
            <p>Welcome to Web Starter Kit.</p>
            <h2 id="get-started">Get Started.</h2>
            <p>Read how to <a href="http://developers.google.com/web/starter-kit">
              Get Started</a> or check out the <a href="styleguide/index.html">Style Guide.</a>
            </p>
          </main>
        );
    }
}

export var Main = React.createClass(_Main.prototype);
