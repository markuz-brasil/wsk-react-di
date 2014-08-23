
class _Body {
  getClassName() {
      return 'foo';
  }

  render() {
    var x = 'x';

    return (
        <div className={`${x} ${this.getClassName()} bar`}>
            Hello there!
        </div>
    );
  }
}

export var Body = React.createClass(_Body.prototype);
