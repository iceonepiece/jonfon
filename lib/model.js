module.exports = Model;

function Model(inputMatrix, rowLabels, colLabels) {

  this.rowLabels = rowLabels; 
  this.colLabels = colLabels; 
  this.input = inputMatrix; 
  this.output = {};
}

Model.prototype.neighbors = function(row){

  if( this.output == null || this.output['neighbors'] == undefined )
    return;

  if( row == undefined ){
    return this.output['neighbors'];
  }

  var rowIndex = row;
    
  if(this.rowLabels)
    rowIndex = findInArray(this.rowLabels, row);

  var output = this.output['neighbors'][rowIndex];

  if( this.rowLabels ){
    for( var i in output ){
      output[i].user = this.rowLabels[ output[i].user ];
    }
  }

  return output;
}

Model.prototype.addOutput = function(name, data){

  this.output[name] = data;
}

Model.prototype.recommendations = function(row){

  if( this.output == null || this.output['recommendations'] == undefined )
    return;

  if( row == undefined ){
    return this.output['recommendations'];
  }

  var rowIndex = row;
    
  if(this.rowLabels)
    rowIndex = findInArray(this.rowLabels, row);

  var output = this.output['recommendations'][rowIndex];

  if( this.colLabels ){
    for( var i in output ){
      output[i].item = this.colLabels[ output[i].item ];
    }
  }

  return output;
}

Model.prototype.ratings = function(row){

  var rowIndex = row;
    
  if(this.rowLabels)
    rowIndex = findInArray(this.rowLabels, row);

  return this.input[rowIndex];
}

function findInArray(array, value)
{
  for(var i=0; i<array.length; i++){

    if(array[i] == value) 
      return i;
  }
  
  return -1;
}