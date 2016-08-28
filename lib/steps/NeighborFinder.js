module.exports = NeighborFinder;

var similarity = require('../similarity');

function NeighborFinder(options){

  this._threshold = 0;
  this._similarity = similarity['pearson'];

  if( options != undefined && options.threshold != undefined ){
    this._threshold = options.threshold;
  }

  if(options && options.similarity){
    this._similarity = similarity[options.similarity];
  }


}

NeighborFinder.prototype.run = function(model, options){

  var neighbors = new Array();
  var ratingMatrix = model.input;

  var usingSimilarity = this._similarity;
  if( options && options.similarity && similarity[options.similarity] ){
    usingSimilarity = similarity[options.similarity];
  }

  var usingThreshold = this._threshold;
  if( options && options.threshold ){
    usingThreshold = options.threshold;
  }

  for( var row1 = 0; row1 < ratingMatrix.length; row1++ ){

    neighbors.push([]);

    for( var row2 = 0; row2 < ratingMatrix.length; row2++ ){

      if( row1 === row2 )
        continue;

      var prefTable = [[],[]];

      for( var col in ratingMatrix[row1] ){

        if( ratingMatrix[row1][col] != null && ratingMatrix[row2][col] != null ){
          prefTable[0].push( ratingMatrix[row1][col] );
          prefTable[1].push( ratingMatrix[row2][col] );
        }
      }

      var simScore = usingSimilarity( prefTable, 0, 1 );

      if( simScore >= usingThreshold ){
        neighbors[row1].push( { user: row2, similarity: simScore } );
      }
    }
  }

  model.addOutput('neighbors', neighbors);
}
