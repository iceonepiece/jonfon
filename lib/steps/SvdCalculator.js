
var _ = require('lodash');
var svd = require('node-svd').svd;
var sylvester = require('sylvester');

module.exports = SvdCalculator;

function SvdCalculator(){

}

SvdCalculator.prototype.run = function(model, options){

  console.log('SvdCalculator');

  var iterations = 1;
  var dim = 0;
  
  if( options.svdDimensions ){
    dim = options.svdDimensions;
  }

  if( options.svdIterations ){
    iterations = options.svdIterations;
  }

  var predictedMatrix = _.cloneDeep( model.output['filledMatrix'] );
  var originalMatrix = model.input;

  for( var i = 0; i < iterations; i++ ){
    predictedMatrix = doSvd(predictedMatrix, originalMatrix, dim);
  }

  model.addOutput('predictedMatrix', predictedMatrix);
}


function doSvd(predictedMatrix, originalMatrix, dim){

  var res = svd(predictedMatrix, dim);
  var U = sylvester.Matrix.create( res.U );
  var S = sylvester.Matrix.Diagonal(res.S);
  var V = sylvester.Matrix.create( res.V );

  var svdMatrix = U.x(S).x(V);
  var predictedMatrix = svdMatrix.elements;

  // fill only null entries in original matrix
  for( var row in originalMatrix ){

    for( var col in originalMatrix[row] ){

      if( originalMatrix[row][col] != null ){
        predictedMatrix[row][col] = Number( (originalMatrix[row][col]).toFixed(4) );
      } else{
        predictedMatrix[row][col] = Number( (predictedMatrix[row][col]).toFixed(4) );
      }
    }
  }

  return predictedMatrix;
}

