
var Model = require('./model');

function Engine( options ){

  this._name = 'jonfon';
  this._version = '0.0.1';
  this._factors = [];
  this._strategies = {};
  this._data = null;
  this._inputData = {};
  this._models = {};
  this._templates = ['UserKNN', 'UserKNN-Jaccard', 'SVD'];

  if( options !== undefined && options.factors ){
    this._factors = options.factors;
  }
}

Engine.prototype.addInputData = function( name, inputMatrix, rowLabels, colLabels ){

  if( name == undefined || inputMatrix == undefined )
    return;

  this._inputData[name] = new Model(inputMatrix, rowLabels, colLabels);
}

Engine.prototype.addModel = function( name, inputMatrix, rowLabels, colLabels ){

  if( name == undefined || inputMatrix == undefined )
    return;

  this._models[name] = new Model(inputMatrix, rowLabels, colLabels);
}

Engine.prototype.getModel = function( name ){
  return this._models[name];
}

Engine.prototype.addStrategy = function( name, strategy ){
	this._strategies[name] = strategy;
}

Engine.prototype.getStrategy = function( name ){
  return this._strategies[name];
}

Engine.prototype.getStrategies = function(){
  return this._strategies;
}

Engine.prototype.getTemplates = function(){
  return this._templates;
}


Engine.prototype.process = function( strategyName, modelName, options ){

	if( this._strategies[strategyName] === undefined ){
		throw new Error('Not found this strategy');
  }
	
  if( this._models[modelName] === undefined ){
    throw new Error('Not found this inputData');
  }

	return this._strategies[strategyName].process( this._models[modelName], options );
}

module.exports.Engine = Engine;
module.exports.Strategy = require('./strategy');
module.exports.similarity = require('./similarity');
module.exports.Model = Model;

