
var expect  = require("chai").expect;

var jonfon = require('../index');
var Engine = jonfon.Engine;
var Strategy = jonfon.Strategy;

describe('-> UserKNN', function(){

  var engine = new Engine();
  var approach = 'UserKNN';

  var userLabels = ['User1', 'User2', 'User3', 'User4', 'User5'];
  var itemLabels = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6'];

  var ratingMatrix =  [
    [    7,    6,    7,    4,    5,    4 ],
    [    6,    7, null,    4,    3,    4 ],
    [ null,    3,    3,    1,    1, null ],
    [    1,    2,    2,    3,    3,    4 ],
    [    1, null,    1,    2,    3,    3 ]
  ];

  engine.addStrategy(approach, new Strategy(approach));

  it('use pearson', function(){

    engine.addModel('pearson', ratingMatrix, userLabels, itemLabels);
    engine.process(approach, 'pearson');

    var model = engine.getModel('pearson');
    var neighborsOfUser3 = model.neighbors('User3');

    expect(neighborsOfUser3).to.deep.equal([
      { user: 'User2', similarity: 0.9707 },
      { user: 'User1', similarity: 0.8944 }
    ]);

  });

  it('use cosine', function(){

    engine.addModel('pearson', ratingMatrix, userLabels, itemLabels);

    var options = {
      similarity: 'cosine'
    }

    engine.process(approach, 'pearson', options);

    var model = engine.getModel('pearson');
    var neighborsOfUser3 = model.neighbors('User3');

    expect(neighborsOfUser3).to.deep.equal([
      { user: 'User2', similarity: 0.9814 },
      { user: 'User1', similarity: 0.9562 },
      { user: 'User4', similarity: 0.7894 },
      { user: 'User5', similarity: 0.6447 }
    ]);

  });

});
