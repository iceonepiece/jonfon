const Recommender = require('../index').NewEngine;
const expect  = require("chai").expect;

describe('<< New Engine Similarity >>', function(){

  it('cosine()', function(){
    var cosinePrefs = [
      [ 6, 7, 4, 5 ],
      [ 3, 3, 1, 1 ],
      [ 2, 2, 3, 3 ],
      [ 1, 1, 2, 3 ]
    ]

    const model = Recommender.cosine(cosinePrefs);
    expect(model[1][0].toFixed(4)).to.equal('0.9562');
    expect(model[1][1].toFixed(4)).to.equal('1.0000');
    expect(model[1][2].toFixed(4)).to.equal('0.7894');
    expect(model[1][3].toFixed(4)).to.equal('0.6351');
  });

  it('calculateJaccard()', () => {
    const A = [ 1, 0, 1 ];
    const B = [ 1, 0, 2 ];
    const C = [ 0, 0, 0 ];
    const D = [ 1, 1, 1 ];

    expect(Recommender.calculateJaccard(A, B)).to.deep.equal({ top: 1.5, bot: 2 });
    expect(Recommender.calculateJaccard(A, C)).to.deep.equal({ top: 0, bot: 2 });
    expect(Recommender.calculateJaccard(A, D)).to.deep.equal({ top: 2, bot: 3 });
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

    const model = Recommender.newJaccard(testPrefs);
    expect(model[0][1].toFixed(4)).to.equal('0.7500');
    expect(model[0][2].toFixed(4)).to.equal('1.0000');
    expect(model[0][3].toFixed(4)).to.equal('0.0000');
    expect(model[0][4].toFixed(4)).to.equal('0.6667');
    expect(model[4][5].toFixed(4)).to.equal('0.5000');
  });

  it('newJaccard() using sparse matrix', function(){
    var testPrefs = [
      [ 1, 0, 1 ],
      [ 1, 0, 2 ],
      [ 1, 0, 1 ],
      [ 0, 1, 0 ],
      [ 1, 1, 1 ],
      [ 2, 2, 2 ]
    ];

    const model = Recommender.newJaccard2(testPrefs);
    expect(model[0][1].toFixed(4)).to.equal('0.7500');
    expect(model[0][2].toFixed(4)).to.equal('1.0000');
    expect(model[0][3].toFixed(4)).to.equal('0.0000');
    expect(model[0][4].toFixed(4)).to.equal('0.6667');
    expect(model[4][5].toFixed(4)).to.equal('0.5000');
  });
});
