var expect  = require("chai").expect;

var jonfon = require('../index');
var similarity = jonfon.similarity;

describe('<< Similarity algorithms >>', function(){

  var ratingPrefs = [
      [ 5, 3, 4, 4 ],
      [ 3, 1, 2, 3 ],
      [ 4, 3, 4, 3 ],
      [ 3, 3, 1, 5 ],
      [ 1, 5, 5, 2 ]
    ];

  var binaryPrefs = [
      [ 0, 0, 0, 0, 0 ],
      [ 1, 0, 0, 0, 0 ],
      [ 0, 1, 1, 1, 0 ],
      [ 0, 0, 0, 0, 1 ],
      [ 1, 1, 1, 1, 1 ],
      [ 1, 1, 0, 0, 0 ]
    ];

  it('pearson()', function(){

    expect(similarity.pearson(ratingPrefs, 0, 1)).to.equal(0.8528);
    expect(similarity.pearson(ratingPrefs, 0, 2)).to.equal(0.7071);
    expect(similarity.pearson(ratingPrefs, 0, 3)).to.equal(0);
    expect(similarity.pearson(ratingPrefs, 0, 4)).to.equal(-0.7921);
  });

  it('jaccard()', function(){

    expect(similarity.jaccard(binaryPrefs, 0, 0)).to.equal(0);
    expect(similarity.jaccard(binaryPrefs, 0, 1)).to.equal(0);
    expect(similarity.jaccard(binaryPrefs, 1, 1)).to.equal(1);
    expect(similarity.jaccard(binaryPrefs, 1, 4)).to.equal(0.2);
    expect(similarity.jaccard(binaryPrefs, 2, 4)).to.equal(0.6);
    expect(similarity.jaccard(binaryPrefs, 2, 5)).to.equal(0.25);
    expect(similarity.jaccard(binaryPrefs, 3, 4)).to.equal(0.2);
  });


});