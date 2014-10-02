import {annotate, Inject, Injector} from 'di'
import {BaseCtrl} from '../Core'
import {CardState} from './annotations'

export class CardCtrl extends BaseCtrl {
  constructor (cardState) { return super(cardState) }

  render() {
    // this.state.promise.then(function(val){
    //   console.log('###', val)
    // })
    return (
       <div className="card-wrap">
          <div className="panel-heading">
              <h3 className="panel-title">
                {this.state.title.toString()}
              </h3>
          </div>
          <div className="panel-body">
            {this.state.body.toString()}
          </div>
        </div>
    );
  }
}
annotate(CardCtrl, new Inject(CardState))

export var Card = new Injector([]).get(CardCtrl)

