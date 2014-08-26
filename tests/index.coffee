# chai should is also enabled.

chai.config.showDiff = false

describe 'index.html', ->

  before =>
    casper.start 'http://localhost:3000/'

  it 'expect the page title to be `Web Starter Kit`', ->
    casper.then ->
      expect(@getTitle()).to.equal 'Web Starter Kit'

  # it 'expect this test to fail', (done) ->
  #   console.log('console.log also works ...')
  #   casper.then ->
  #     expect(@getTitle()).to.equal 'Web Starter Kit blabla'
