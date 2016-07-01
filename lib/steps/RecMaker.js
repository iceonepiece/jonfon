module.exports = RecMaker;

function RecMaker(){

}

RecMaker.prototype.run = function(model){

  var recommendations = [];

  var neighborTable = model.output['neighbors'];
  var meanTable = [];
  var ratingMatrix = model.input;

  // calculate means
  for( var i in ratingMatrix ){

    var sum = 0;
    var num = 0;
    
    for( var j in ratingMatrix[i] ){

      if( ratingMatrix[i][j] != null ){
        sum += ratingMatrix[i][j];
        num += 1;
      }
    }

    meanTable.push( sum / num );

  }

  var recommendations = [];

  for( var i in neighborTable ){
    
    recommendations.push( makeRecForUser(i, ratingMatrix, neighborTable[i], meanTable) );
  }

  model.addOutput('recommendations', recommendations);

}

function makeRecForUser( user, ratingMatrix, neighbors, meanTable ){

  var scoreSum = {};
  var similaritySum = {};

  var myRatedItems = ratingMatrix[user];

  for( var i in neighbors ){

    var other = Number(neighbors[i].user);
    var neighborRatedItems = ratingMatrix[other];
    
    for( var j in neighborRatedItems ){

      if( neighborRatedItems[j] != null && myRatedItems[j] == null ){

        if( scoreSum[String(j)] === undefined ){
          scoreSum[String(j)] = 0;
          similaritySum[String(j)] = 0;
        }

        scoreSum[String(j)] += neighbors[i].similarity * ( neighborRatedItems[j] - meanTable[other] );
        similaritySum[String(j)] += neighbors[i].similarity;
      }

    }
  }

  var candidateItems = [];
  var itemKeys = Object.keys( scoreSum );

  for( var i in itemKeys ){

    var item = {};
    item.item = itemKeys[i];
    
    var score = meanTable[user] + ( scoreSum[itemKeys[i]] / similaritySum[itemKeys[i]] );
    item.score = Number(score.toFixed(4));

    candidateItems.push(item);
  }

  return candidateItems;
}


function getUnratedItems( ratingMatrix, first, second ){

  if( ratingMatrix[first].length != ratingMatrix[second].length )
    return;

  var unratedItems = [];

  for( var col in ratingMatrix[first] ){

    if( ratingMatrix[first][col] == null && ratingMatrix[second][col] != null ){
      unratedItems.push( col );
    }

  } 

  return unratedItems;
}

