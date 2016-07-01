var step  = require('./steps');

module.exports = Strategy;

function Strategy(name){

  this._name = name;
  this._procedure = [];

  if( this._name === 'simple')
    this.initProcedure();
}

Strategy.prototype.initProcedure = function(){

  this._procedure.push( new step.NeighborFinder() );
  this._procedure.push( new step.RecMaker() );
}

Strategy.prototype.process = function(model){

  for( var p in this._procedure ){
    this._procedure[p].run(model);
  }

}

Strategy.prototype.showInfo = function(){
  return 'Strategy name: ' + this._name;
}