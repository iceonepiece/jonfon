var expect  = require("chai").expect;
var jonfon = require('../index');
var metrics = jonfon.metrics;

describe('<< Metrics >>', function(){

  // in progress
  /*
  it('ROC Curve', function(){

    var tests = [1, 1, 2, 2];
    var predictions = [0.1, 0.4, 0.35, 0.8];

    var result = metrics.roc(tests, predictions);

    expect(result.fpr).to.equal([ 0.0,  0.5,  0.5,  1.0 ]);
    expect(result.tpr).to.equal([ 0.5,  0.5,  1.0,  1.0 ]);
  });
  */

  it('AUC', function(){

    var n = 2;
    var fpr = [
      [ 0.0,  0.5,  0.5,  1.0 ],
      [ 0.0,  0.0,  0.5,  0.5,  1.0 ]
    ];
    var tpr = [
      [ 0.5,  0.5,  1.0,  1.0 ],
      [ 0.33, 0.67,  0.67,  1.0, 1.0 ]
    ];

    var auc = [
      0.75,
      0.835
    ];

    for( var i = 0; i < n; i++ ){
      var realAuc = metrics.auc(fpr[i], tpr[i]);
      expect(realAuc).to.equal(auc[i]);
    }

  });

});
