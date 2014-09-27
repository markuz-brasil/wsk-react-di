import {Inject, Provide} from 'di'
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

@Provide(Body)
export class MockBody {
  toString () {
    return 'mock:'
  }
}

@Provide(Title)
export class MockTitle {
  toString () {
    return 'mock:'
  }
}

@Inject(Body, Title)
export class CardState extends BaseState {
  constructor(body, title) {
    return super({ body: body, title: title })
  }
}

@Provide(CardState)
@Inject(MockBody, MockTitle)
export class MockCardState extends BaseState {
  constructor(body, title) {
    return super({ body: body, title: title })
  }
}





