// var React = require('react');


class _DefautCard {
  render() {
    return <div>  </div>
  }
}

var DefautCard = React.createClass(_DefautCard.prototype)

class _CardCtrl {
  getInitialState () {
    return {
      body: !!this.props.body ? this.props.body : DefautCard,
      title: !!this.props.title ? this.props.title: `${Math.random()}`,
    }
  }

  render() {
    return (
       <div className="card-wrap">
          <div className="panel-heading">
              <h3 className="panel-title"> {this.state.title} </h3>
          </div>
          <div className="panel-body">
            <this.state.body ctx={this.props.ctx}/>
          </div>
        </div>
    );
  }
}

export var CardCtrl = React.createClass(_CardCtrl.prototype);

