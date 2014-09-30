import {annotate, Injector, Inject, Provide} from 'di';

import {BaseState} from '../Core'
import {youTubeInitState} from './youtube'


export class AppState extends BaseState {
  constructor (ctx) { return super(ctx) }
}
annotate(AppState, new Inject(youTubeInitState))

export {YouTubeCardState, fetchYouTubeJson} from './youtube'
