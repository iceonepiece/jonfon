var expect  = require("chai").expect;

var jonfon = require('../index');
var Engine = jonfon.Engine;
var Strategy = jonfon.Strategy;


describe('<< Engine Class >>', function(){

  it('new Engine()', function(){

    var engine = new Engine();

    expect(typeof engine).to.equal('object');
    expect(engine._name).to.equal('jonfon');
    expect(engine._factors).to.deep.equal([]);
    expect(engine._strategies).to.deep.equal({});
  });

  it('process()', function(){

    var engine = new Engine();

    engine.addStrategy('simple', new Strategy());
    engine.addModel('sampleData', []);

    try{
      engine.process('nothing', 'sampleData');
    } catch(err){
      expect(err.message).to.equal('Not found this strategy');
    }

    try{
      engine.process('simple', 'none');
    } catch(err){
      expect(err.message).to.equal('Not found this inputData');
    }

    engine.process('simple', 'sampleData');
  });

  it('process() - simple approach', function(){

    var engine = new Engine();

    engine.addStrategy('simple', new Strategy('simple'));
    engine.addModel('sampleData', []);

    engine.process('simple', 'sampleData');

    var model = engine.getModel('sampleData');

    expect(model.neighbors()).to.deep.equal([]);
    expect(model.recommendations()).to.deep.equal([]);
  });

  it('getTemplates()', function(){

    var engine = new Engine();
    var templates = engine.getTemplates();

    expect(templates)
    .to.deep.equal(['simple']);

  });

  it('getStrategies()', function(){

    var engine = new Engine();

    var strategies = engine.getStrategies();
    expect(strategies).to.deep.equal({});

    engine.addStrategy('first', new Strategy());

    var strategyNames = Object.keys( engine.getStrategies() );

    expect(strategyNames.length).to.deep.equal(1);

    engine.addStrategy('second', new Strategy());
    engine.addStrategy('third', new Strategy());
    strategyNames = Object.keys( engine.getStrategies() );
    expect(strategyNames.length).to.deep.equal(3);

  });

  it('addStrategy() and getStrategy()', function(){

    var engine = new Engine();

    expect(engine.getStrategy('something')).to.deep.equal(undefined);
    engine.addStrategy('something', new Strategy());
    expect(engine.getStrategy('something')).to.deep.not.equal(undefined);
  });

  it('addModel() and getModel()', function(){

    var engine = new Engine();

    expect(engine.getModel('sampleData')).to.deep.equal(undefined);
    
    engine.addModel('sampleData', []);
    var model = engine.getModel('sampleData');
    
    expect(model.input).to.deep.equal([]);
    expect(model.output).to.deep.equal({});
    expect(model.rowLabels).to.deep.equal(undefined);
    expect(model.colLabels).to.deep.equal(undefined);

    var fooMatrix = [
      [ 1, 2, 3 ],
      [ 4, 5, 6 ]
    ];

    var fooRowLabels = [ 'User1', 'User2' ];
    var fooColLabels = [ 'Item1', 'Item2', 'Item3' ];

    engine.addModel('foo', fooMatrix, fooRowLabels, fooColLabels);
    var model = engine.getModel('foo');
    
    expect(model.input).to.deep.equal([
        [ 1, 2, 3 ],
        [ 4, 5, 6 ]
      ]);

    expect(model.output).to.deep.equal({});
    expect(model.rowLabels).to.deep.equal([ 'User1', 'User2' ]);
    expect(model.colLabels).to.deep.equal([ 'Item1', 'Item2', 'Item3' ]);
      
  });
});

