var expect  = require("chai").expect;

var jonfon = require('../index');
var Engine = jonfon.Engine;
var Strategy = jonfon.Strategy;

describe('<< Practical >>', function(){

  var engine = new Engine();
  var approach = 'UserKNN';
  var approachJaccard = 'UserKNN_Jaccard';

  engine.addStrategy(approach, new Strategy(approach));
  engine.addStrategy(approachJaccard, new Strategy(approachJaccard));

  it('UserKNN approach', function(){

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

    var options = {
      threshold: 0.5
    };

    engine.process(approach, 'one', options);

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


  it('UserKNN approach with rank items', function(){

    var userLabels = ['Lisa Rose', 'Gene Seymour', 'Michael Phillips',
                      'Claudia Puig', 'Mick LaSalle', 'Jack Matthews', 'Toby' ];
    var itemLabels = ['Lady in the Water', 'Snakes on a Plane', 'Just My Luck',
                      'Superman Returns', 'You, Me and Dupree', 'The Night Listener'];

    var ratingMatrix =  [
      [   2.5,  3.5,  3.0,  3.5,  2.5,  3.0  ],
      [   3.0,  3.5,  1.5,  5.0,  3.5,  3.0  ],
      [   2.5,  3.0, null,  3.5, null,  4.0  ],
      [  null,  3.5,  3.0,  4.0,  2.5,  4.5  ],
      [   3.0,  4.0,  2.0,  3.0,  2.0,  3.0  ],
      [   3.0,  4.0, null,  5.0,  3.5,  3.0  ],
      [  null,  4.5, null,  4.0,  1.0, null  ]
    ];

    engine.addModel('one', ratingMatrix, userLabels, itemLabels);

    engine.process(approach, 'one');

    var model = engine.getModel('one');

    var twoNeighborsOfToby = model.neighbors('Toby', 2);
    var threeNeighborsOfToby = model.neighbors('Toby', 3);
    var fourNeighborsOfToby = model.neighbors('Toby', 4);

    var oneRecsOfToby = model.recommendations('Toby', 1);
    var twoRecsOfToby = model.recommendations('Toby', 2);
    var threeRecsOfToby = model.recommendations('Toby', 3);

    expect(twoNeighborsOfToby).to.deep.equal([
      { user: 'Lisa Rose', similarity: 0.9912 },
      { user: 'Mick LaSalle', similarity: 0.9245 }
    ]);

    expect(threeNeighborsOfToby).to.deep.equal([
      { user: 'Lisa Rose', similarity: 0.9912 },
      { user: 'Mick LaSalle', similarity: 0.9245 },
      { user: 'Claudia Puig', similarity: 0.8934 }
    ]);

    expect(fourNeighborsOfToby).to.deep.equal([
      { user: 'Lisa Rose', similarity: 0.9912 },
      { user: 'Mick LaSalle', similarity: 0.9245 },
      { user: 'Claudia Puig', similarity: 0.8934 },
      { user: 'Jack Matthews', similarity: 0.6628 }
    ]);

    expect(oneRecsOfToby).to.deep.equal([
      { item: 'The Night Listener', score: 3.2934 }
    ]);

    expect(twoRecsOfToby).to.deep.equal([
      { item: 'The Night Listener', score: 3.2934 },
      { item: 'Lady in the Water', score: 2.8623 }
    ]);

    expect(threeRecsOfToby).to.deep.equal([
      { item: 'The Night Listener', score: 3.2934 },
      { item: 'Lady in the Water', score: 2.8623 },
      { item: 'Just My Luck', score: 2.5761 }
    ]);

  });

});
