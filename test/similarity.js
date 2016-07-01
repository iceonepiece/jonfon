var expect  = require("chai").expect;

var jonfon = require('../index');
var similarity = jonfon.similarity;

describe('<< Similarity algorithms >>', function(){

  var prefs = [
      [ 5, 3, 4, 4 ],
      [ 3, 1, 2, 3 ],
      [ 4, 3, 4, 3 ],
      [ 3, 3, 1, 5 ],
      [ 1, 5, 5, 2 ]
    ];

  it('pearson()', function(){

    expect(similarity.pearson(prefs, 0, 1)).to.equal(0.8528);
    expect(similarity.pearson(prefs, 0, 2)).to.equal(0.7071);
    expect(similarity.pearson(prefs, 0, 3)).to.equal(0);
    expect(similarity.pearson(prefs, 0, 4)).to.equal(-0.7921);
  });


});