module.exports = JaccardRecMaker;

function JaccardRecMaker(){

}

JaccardRecMaker.prototype.run = function(model, options){
  
  var recommendations = [];
  var neighborTable = model.output['neighbors'];
  var ratingMatrix = model.input;

  for( var i in neighborTable ){
    recommendations.push( makeRecForUser(i, ratingMatrix, neighborTable[i] ) );
  }

  model.addOutput('recommendations', recommendations);
}

function makeRecForUser( user, ratingMatrix, neighbors ){


  var scoreSum = {};
  var similaritySum = {};

  var myRatedItems = ratingMatrix[user];

  for( var i in neighbors ){

    var other = Number(neighbors[i].user);
    var neighborRatedItems = ratingMatrix[other];
    
    for( var j in neighborRatedItems ){

      if( neighborRatedItems[j] && !myRatedItems[j] ){

        if( scoreSum[String(j)] === undefined ){
          scoreSum[String(j)] = 0;
          similaritySum[String(j)] = 0;
        }

        scoreSum[String(j)] += neighbors[i].similarity;
        similaritySum[String(j)] += 1;
      }

    }
  }


  var candidateItems = [];
  var itemKeys = Object.keys( scoreSum );

  for( var i in itemKeys ){

    var item = {};
    item.item = itemKeys[i];

    var score = scoreSum[itemKeys[i]] / similaritySum[itemKeys[i]];
    item.score = Number(score.toFixed(4));

    candidateItems.push(item);
  }

  return candidateItems;
}
