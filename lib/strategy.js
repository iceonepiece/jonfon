var step  = require('./steps');

module.exports = Strategy;

function Strategy(name, options){

  this._name = name;
  this._procedure = [];
  this._options = {};

  if(options)
    this._options = options;

  if( this._name === 'UserKNN')
    this.initUserKNN();

  if( this._name === 'SVD' )
    this.initSVD();

  if( this._name === 'UserKNN-Jaccard')
    this.initUserKNNJaccard();

}

Strategy.prototype.initSVD = function(){

  this._procedure.push( new step.EntryFiller() );
  this._procedure.push( new step.SvdCalculator() );
  this._procedure.push( new step.SvdRecMaker() );
}

Strategy.prototype.initUserKNN = function(){

  this._procedure.push( new step.NeighborFinder() );
  this._procedure.push( new step.RecMaker() );
}

Strategy.prototype.initUserKNNJaccard = function(){

  this._procedure.push( new step.NeighborFinder({
    similarity: 'jaccard',
    threshold: 0
  }));

  this._procedure.push( new step.JaccardRecMaker() );
}

Strategy.prototype.process = function(model, options){

  var usingOptions = this._options;

  if( options ){
    usingOptions = options;
  }

  for( var p in this._procedure ){
    this._procedure[p].run(model, usingOptions);
  }

}

Strategy.prototype.showInfo = function(){
  return 'Strategy name: ' + this._name;
}