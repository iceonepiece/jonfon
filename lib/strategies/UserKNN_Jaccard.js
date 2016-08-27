
var Step = require('../steps');

module.exports = function(){

  var steps = [];

  steps.push( new Step.NeighborFinder({
    similarity: 'newJaccard',
  }));
  steps.push( new Step.JaccardRecMaker() );

  return steps;
}
