import {annotate, Injector, Inject, Provide} from 'di';
import {BaseState} from '../Core'
import {redditInitState} from './reddit'

export {RedditCardState, fetchReddit} from './reddit'

export class AppState extends BaseState {
  constructor (ctx) { return super(ctx) }
}
annotate(AppState, new Inject(redditInitState))


