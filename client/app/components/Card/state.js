import {annotate, Inject, Provide} from 'di'
import {BaseState} from '../Core'

export class Title {
  toString () {
    return 'title: '+ Math.random()
  }
}

export class Body {
  toString () {
    return 'body: '+ Math.random()
  }
}

export class CardState extends BaseState {
  constructor(body, title) {
    return super({ body: body, title: title })
  }
}
annotate(CardState, new Inject(Body, Title))

export class MockBody {
  toString () {
    return 'mock:'
  }
}
annotate(MockBody, new Provide(Body))

export class MockTitle {
  toString () {
    return 'mock:'
  }
}
annotate(MockTitle, new Provide(Title))


export class MockCardState extends BaseState {
  constructor(body, title) {
    return super({ body: body, title: title })
  }
}
annotate(MockCardState, new Provide(CardState))
annotate(MockCardState, new Inject(MockBody, MockTitle))


