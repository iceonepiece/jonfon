var expect  = require("chai").expect;

var jonfon = require('../index');
var Engine = jonfon.Engine;
var Strategy = jonfon.Strategy;

describe('<< Practical >>', function(){

  var engine = new Engine();
  var approach = 'UserKNN-Jaccard';

  engine.addStrategy(approach, new Strategy(approach));

  it('UserKNN-Jaccard approach', function(){

    var userLabels = ['Alice', 'User1', 'User2', 'User3', 'User4'];
    var itemLabels = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5'];

    var ratingMatrix =  [
      [ 0, 1, 1, 0, 0 ],
      [ 1, 0, 0, 1, 1 ],
      [ 1, 0, 1, 0, 1 ],
      [ 0, 0, 0, 1, 1 ],
      [ 1, 1, 1, 0, 0 ]
    ];

    engine.addModel('jaccard', ratingMatrix, userLabels, itemLabels);

    var options = {
      threshold: 0.1
    };

    engine.process(approach, 'jaccard', options);

    var model = engine.getModel('jaccard');

    var neighborsOfAlice = model.neighbors('Alice');
    var recsOfAlice = model.recommendations('Alice');
    console.log( 'Jaccard:', neighborsOfAlice );
    console.log( 'Jaccard:', recsOfAlice );

    expect(neighborsOfAlice).to.deep.equal([
      { user: 'User4', similarity: 0.6667 },
      { user: 'User2', similarity: 0.25 }
    ]);

    expect(recsOfAlice).to.deep.equal([
      { item: 'Item1', score: 0.4583 },
      { item: 'Item5', score: 0.25 }
    ]);

  });

});
