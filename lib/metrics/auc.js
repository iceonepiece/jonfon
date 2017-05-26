'use strict';

function auc(x, y){
  const cutoffs = [true ? Number.MIN_VALUE : Number.MAX_VALUE];
  const l = x.length;
  var auc = 0;
  for (var i = 1; i < l; i++) {
      auc += 0.5 * (x[i] - x[i - 1]) * (y[i] + y[i - 1]);
  }
  return auc;
}

function roc(tests, predictions){

}

module.exports = auc;
