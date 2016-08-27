
var Step = require('../steps');

module.exports = function(){

  var steps = [];

  steps.push( new Step.NeighborFinder() );
  steps.push( new Step.RecMaker() );

  return steps;
}
