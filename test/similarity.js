var expect  = require("chai").expect;

var jonfon = require('../index');
var similarity = jonfon.similarity;

describe('<< Similarity algorithms >>', function(){

  it('cosine()', function(){
    var cosinePrefs = [
      [ 6, 7, 4, 5 ],
      [ 3, 3, 1, 1 ],
      [ 2, 2, 3, 3 ],
      [ 1, 1, 2, 3 ]
    ]

    var cosine = similarity.cosine;
    expect(cosine(cosinePrefs, 1, 0)).to.equal(0.9562);
    expect(cosine(cosinePrefs, 1, 1)).to.equal(1);
    expect(cosine(cosinePrefs, 1, 2)).to.equal(0.7894);
    expect(cosine(cosinePrefs, 1, 3)).to.equal(0.6351);
  });

  it('pearson()', function(){
    var ratingPrefs = [
        [ 5, 3, 4, 4 ],
        [ 3, 1, 2, 3 ],
        [ 4, 3, 4, 3 ],
        [ 3, 3, 1, 5 ],
        [ 1, 5, 5, 2 ]
      ];

    var pearson = similarity.pearson;
    expect(pearson(ratingPrefs, 0, 1)).to.equal(0.8528);
    expect(pearson(ratingPrefs, 0, 2)).to.equal(0.7071);
    expect(pearson(ratingPrefs, 0, 3)).to.equal(0);
    expect(pearson(ratingPrefs, 0, 4)).to.equal(-0.7921);
  });

  it('jaccard()', function(){

    var binaryPrefs = [
        [ 0, 0, 0, 0, 0 ],
        [ 1, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 0 ],
        [ 0, 0, 0, 0, 1 ],
        [ 1, 1, 1, 1, 1 ],
        [ 1, 1, 0, 0, 0 ]
      ];

    var jaccard = similarity.jaccard;
    expect(jaccard(binaryPrefs, 0, 0)).to.equal(0);
    expect(jaccard(binaryPrefs, 0, 1)).to.equal(0);
    expect(jaccard(binaryPrefs, 1, 1)).to.equal(1);
    expect(jaccard(binaryPrefs, 1, 4)).to.equal(0.2);
    expect(jaccard(binaryPrefs, 2, 4)).to.equal(0.6);
    expect(jaccard(binaryPrefs, 2, 5)).to.equal(0.25);
    expect(jaccard(binaryPrefs, 3, 4)).to.equal(0.2);
  });

  it('newJaccard()', function(){
    var testPrefs = [
      [ 1, 0, 1 ],
      [ 1, 0, 2 ],
      [ 1, 0, 1 ],
      [ 0, 1, 0 ],
      [ 1, 1, 1 ],
      [ 2, 2, 2 ]
    ];

    var newJaccard = similarity.newJaccard;
    expect(newJaccard(testPrefs, 0, 1)).to.equal(0.75);
    expect(newJaccard(testPrefs, 0, 2)).to.equal(1);
    expect(newJaccard(testPrefs, 0, 3)).to.equal(0);
    expect(newJaccard(testPrefs, 0, 4)).to.equal(0.6667);
    expect(newJaccard(testPrefs, 4, 5)).to.equal(0.5);
  });

});
