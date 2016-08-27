var step  = require('./steps');
var strategies = require('./strategies');

function Strategy(name, options){

  this._name = name;
  this._procedure = [];
  this._options = {};

  if(options)
    this._options = options;

  var createStrategy = strategies[this._name];

  if( createStrategy ){
    this._procedure = createStrategy();
  }
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

module.exports = Strategy;
