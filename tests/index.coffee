

describe 'my page', ->

  before =>
    casper.start 'https://www.google.com'


  it 'casper should work', (done) ->
    casper.then ->
      console.log('---------', @getTitle())
      # @echo @getTitle()




    # casper.run()
