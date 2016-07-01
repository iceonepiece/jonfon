var expect  = require("chai").expect;

var jonfon = require('../index');
var Model = jonfon.Model;

describe('<< Model Class >>', function(){

  it('new Model()', function(){

    var matrix = [
      [ 1, 2, 3 ],
      [ 4, 5, 6 ]
    ];

    var rowLabels = [ 'User1', 'User2' ];
    var colLabels = [ 'Item1', 'Item2', 'Item3' ];

    var model = new Model(matrix, rowLabels, colLabels);

    expect(model.input).to.deep.equal([
        [ 1, 2, 3 ],
        [ 4, 5, 6 ]
      ]);

    expect(model.rowLabels).to.deep.equal([ 'User1', 'User2' ]);
    expect(model.colLabels).to.deep.equal([ 'Item1', 'Item2', 'Item3' ]);
    expect(model.ratings('User1')).to.deep.equal([ 1, 2, 3 ]);
    expect(model.ratings('User2')).to.deep.equal([ 4, 5, 6 ]);
  });
});