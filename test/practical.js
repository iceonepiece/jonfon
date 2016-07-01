var expect  = require("chai").expect;

var jonfon = require('../index');
var Engine = jonfon.Engine;
var Strategy = jonfon.Strategy;

describe('<< Practical >>', function(){

  it('simple approach', function(){

    var engine = new Engine();
    
    engine.addStrategy('simple', new Strategy('simple'));
    
    var userLabels = ['Alice', 'User1', 'User2', 'User3', 'User4'];
    var itemLabels = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5'];

    var ratingMatrix =  [
      [ 5, 3, 4, 4, null ],
      [ 3, 1, 2, 3, 3 ],
      [ 4, 3, 4, 3, 5 ],
      [ 3, 3, 1, 5, 4 ],
      [ 1, 5, 5, 2, 1 ]
    ];

    engine.addModel('one', ratingMatrix, userLabels, itemLabels);

    engine.process('simple', 'one');

    var model = engine.getModel('one');

    var neighborsOfAlice = model.neighbors('Alice');
    var recsOfAlice = model.recommendations('Alice');

    expect(neighborsOfAlice).to.deep.equal([ 
      { user: 'User1', similarity: 0.8528 },
      { user: 'User2', similarity: 0.7071 } 
    ]);

    expect(recsOfAlice).to.deep.equal([
      { item: 'Item5', score: 4.8720 }
    ]);

  });

});