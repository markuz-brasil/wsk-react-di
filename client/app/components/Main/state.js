import {annotate, Injector, Inject, Provide} from 'di';
import {BaseState} from '../Core'
import {redditInitState, fetchRedditJsonp} from './reddit'

export {RedditCardState} from './reddit'

export class AppState extends BaseState {
  constructor (ctx) { return super(ctx) }
}
annotate(AppState, new Inject(redditInitState))


fetchRedditJsonp()
fetchRedditJsonp()

