

var Recommender = require('../index').NewEngine;
var expect  = require("chai").expect;


describe('<< New Engine Similarity >>', function(){

  it('cosine()', function(){
    var cosinePrefs = [
      [ 6, 7, 4, 5 ],
      [ 3, 3, 1, 1 ],
      [ 2, 2, 3, 3 ],
      [ 1, 1, 2, 3 ]
    ]

    var model = Recommender.cosine(cosinePrefs);
    expect(model[1][0].toFixed(4)).to.equal('0.9562');
    expect(model[1][1].toFixed(4)).to.equal('1.0000');
    expect(model[1][2].toFixed(4)).to.equal('0.7894');
    expect(model[1][3].toFixed(4)).to.equal('0.6351');

  });

});
