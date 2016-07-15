var expect  = require("chai").expect;

var jonfon = require('../index');
var Engine = jonfon.Engine;
var Strategy = jonfon.Strategy;



describe('<< Approach [ SVD ]  >>', function(){

  var approach = 'SVD';
  var engine = new Engine();
  var options = { 
    svdDimensions: 2,
    svdIterations: 1
  };

  engine.addStrategy(approach, new Strategy(approach));

  it('#1 data set', function(){

    var userLabels = ['Alice', 'User1', 'User2', 'User3', 'User4'];
    var itemLabels = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6'];

    var ratingMatrix =  [
      [    1,   -1,    1,   -1,    1,   -1 ],
      [    1,    1, null,   -1,   -1,   -1 ],
      [ null,    1,    1,   -1,   -1, null ],
      [   -1,   -1,   -1,    1,    1,    1 ],
      [   -1, null,   -1,    1,    1,    1 ]
    ];

    engine.addModel('one', ratingMatrix, userLabels, itemLabels);
    engine.process(approach, 'one', options);

    var model = engine.getModel('one');
    var filledMatrix = model.output['filledMatrix'];

    expect(filledMatrix).to.deep.equal([
      [  1,  -1,    1,  -1,  1, -1 ],
      [  1,   1, -0.2,  -1, -1, -1 ],
      [  0,   1,    1,  -1, -1,  0 ],
      [ -1,  -1,   -1,   1,  1,  1 ],
      [ -1, 0.2,   -1,   1,  1,  1 ]
    ]);
    
    var predictedMatrix1 = model.output['predictedMatrix'];

    expect(predictedMatrix1).to.deep.equal([
      [    1,      -1,      1,  -1,  1,    -1 ],
      [    1,       1, 0.5881,  -1, -1,    -1 ],
      [ 0.43,       1,      1,  -1, -1, -0.43 ],
      [   -1,      -1,     -1,   1,  1,     1 ],
      [   -1, -0.2095,     -1,   1,  1,     1 ]
    ]);

    engine.addModel('two', ratingMatrix, userLabels, itemLabels);

    options.svdIterations = 2;
    engine.process(approach, 'two', options);

    var model = engine.getModel('two');

    var predictedMatrix2 = model.output['predictedMatrix'];

    expect(predictedMatrix2).to.deep.equal([
      [    1,      -1,      1,  -1,  1,    -1 ],
      [    1,       1, 0.8826,  -1, -1,    -1 ],
      [ 0.6677,     1,      1,  -1, -1, -0.6677 ],
      [   -1,      -1,     -1,   1,  1,     1 ],
      [   -1, -0.5092,     -1,   1,  1,     1 ]
    ]);

    var recommendations = model.recommendations();

    var oneRecsOfUser1 = model.recommendations('User1', 1);
    var recsOfUser2 = model.recommendations('User2');
    var recsOfUser4 = model.recommendations('User4');

    expect(recommendations.length).to.equal(5);

    expect(oneRecsOfUser1).to.deep.equal([
      { item: 'Item3', score: 0.8826 }
    ]);

    expect(recsOfUser2).to.deep.equal([
      { item: 'Item1', score: 0.6677 },
      { item: 'Item6', score: -0.6677 }
    ]);

  });

  it('recommendations must be sorted already', function(){

    var userLabels = ['Alice', 'User1', 'User2', 'User3', 'User4'];
    var itemLabels = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6'];

    var ratingMatrix =  [
      [    1,   -1,    1,   -1,    1,   -1 ],
      [    1,    1, null,   -1,   -1,   -1 ],
      [ null,    1,    1, null, null, null ],
      [   -1,   -1,   -1,    1,    1,    1 ],
      [   -1, null,   -1,    1,    1,    1 ]
    ];

    engine.addModel('three', ratingMatrix, userLabels, itemLabels);
    
    var options = { 
      svdDimensions: 2,
      svdIterations: 1
    };

    engine.process(approach, 'three', options);

    var model = engine.getModel('three');

    var filledMatrix = model.output['filledMatrix'];
    expect(filledMatrix).to.deep.equal([
      [  1,  -1,    1,  -1,  1, -1 ],
      [  1,   1, -0.2,  -1, -1, -1 ],
      [  1,   1,    1,   1,  1,  1 ],
      [ -1,  -1,   -1,   1,  1,  1 ],
      [ -1, 0.2,   -1,   1,  1,  1 ]
    ]);

    var predictedMatrix1 = model.output['predictedMatrix'];
    expect(predictedMatrix1).to.deep.equal([
      [     1,      -1,      1,     -1,      1,     -1 ],
      [     1,       1, 0.3295,     -1,     -1,     -1 ],
      [0.8502,       1,      1, 0.7508, 1.3981, 0.7508 ],
      [    -1,      -1,     -1,      1,      1,      1 ],
      [    -1, -0.2737,     -1,      1,      1,      1 ]
    ]);

    var rawRecsOfUser2 = model.output['recommendations'][2];
    console.log(rawRecsOfUser2);
    expect(rawRecsOfUser2).to.deep.equal([
      { item: '4', score: 1.3981 },
      { item: '0', score: 0.8502 },
      { item: '3', score: 0.7508 },
      { item: '5', score: 0.7508 }
    ]);

  });

});