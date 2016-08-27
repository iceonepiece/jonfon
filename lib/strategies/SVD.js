
var Step = require('../steps');

module.exports = function(){

  var steps = [];

  steps.push( new Step.EntryFiller() );
  steps.push( new Step.SvdCalculator() );
  steps.push( new Step.SvdRecMaker() );

  return steps;
}
