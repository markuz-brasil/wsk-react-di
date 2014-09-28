import {annotate, Inject, Injector} from 'di'

import {BaseCtrl, http} from '../Core'
import {Card, CardCtrl} from '../Card'
import {MockBody,  MockTitle, MockCardState} from '../Card/state'
import {AppState, RedditCardState, fetchReddit} from './state'

fetchReddit()
fetchReddit()

var CardMockBody = new Injector([MockBody]).get(CardCtrl)
var CardMockTitle = new Injector([MockTitle]).get(CardCtrl)
var CardMock = new Injector([MockCardState]).get(CardCtrl)
var CardDefault = new Injector([]).get(CardCtrl)

export class AppCtrl extends BaseCtrl {
  constructor (appState) { return super(appState) }

  render() {
    return (
      <div>
        <this.state.Elem />
        <CardMockBody />
        <CardMockTitle />
        <CardMock />
        <CardDefault />
        <Card />
      </div>
    );
  }
}
annotate(AppCtrl, new Inject(AppState))

export var App = new Injector([RedditCardState]).get(AppCtrl)

