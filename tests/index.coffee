chai.config.showDiff = false

describe 'my page', ->

  before =>
    casper.start 'http://localhost:3000/'


  it 'expect google title to be `Web Starter Kit`', (done) ->
    casper.then ->
      console.log('console.log also works ...')
      expect(@getTitle()).to.equal 'Web Starter Kit'


  it 'expect this test to fail', (done) ->
    casper.then ->
      expect(@getTitle()).to.equal 'Web Starter Kit -error'
      # @echo @getTitle()




    # casper.run()
