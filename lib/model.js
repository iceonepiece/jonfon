var _ = require('lodash');

module.exports = Model;

function Model(inputMatrix, rowLabels, colLabels) {

  this.rowLabels = rowLabels;
  this.colLabels = colLabels;
  this.input = inputMatrix;
  this.output = {};
}

Model.prototype.neighbors = function(row, n){

  if( this.output == null || this.output['neighbors'] == undefined )
    return;

  if(!n)
    n = 10;

  var neighbors = _.cloneDeep(this.output['neighbors']);

  if( row == undefined ){
    return neighbors;
  }

  var rowIndex = row;


  if(this.rowLabels)
    rowIndex = findInArray(this.rowLabels, row);

  var output = neighbors[rowIndex];

  if( !output ){
    return [];
  }

  if( this.rowLabels ){
    for( var i in output ){
      output[i].user = this.rowLabels[ output[i].user ];
    }
  }

  if( output.length > 0 ){
    output.sort(function(a, b) {return b.similarity - a.similarity;});
  }

  return output.splice(0,n);
}

Model.prototype.addOutput = function(name, data){

  this.output[name] = data;
}

Model.prototype.recommendations = function(row, n){

  if( this.output == null || this.output['recommendations'] == undefined )
    return;

  if(!n)
    n = 10;

  var recommendations = _.cloneDeep(this.output['recommendations']);

  if( row == undefined ){
    return recommendations;
  }

  var rowIndex = row;

  if(this.rowLabels)
    rowIndex = findInArray(this.rowLabels, row);

  var output = recommendations[rowIndex];

  if( this.colLabels ){
    for( var i in output ){
      output[i].item = this.colLabels[ output[i].item ];
    }
  }

  output.sort(function(a, b) {return b.score - a.score;});

  return output.splice(0,n);
}

Model.prototype.ratings = function(row){

  var rowIndex = row;

  if(this.rowLabels)
    rowIndex = findInArray(this.rowLabels, row);

  var ratings = _.cloneDeep(this.input[rowIndex]);

  return ratings;
}

function findInArray(array, value)
{
  for(var i=0; i<array.length; i++){

    if(array[i] == value)
      return i;
  }

  return -1;
}
