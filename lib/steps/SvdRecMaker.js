module.exports = SvdRecMaker;

function SvdRecMaker(){

}


SvdRecMaker.prototype.run = function(model, options){

  var recLimit = 10;

  if( options && options.limit )
    recLimit = options.limit;

  console.log('SvdRecMaker');
  
  var originalMatrix = model.input;
  var predictedMatrix = model.output['predictedMatrix'];

  var recommendations = [];

  for( var i in originalMatrix ){
    recommendations.push( makeRecForUser( predictedMatrix[i], originalMatrix[i], recLimit ) );
  }

  console.log(recommendations);
  model.addOutput('recommendations', recommendations);
}

function makeRecForUser( predictedRow, originalRow, limit ){
  
  var candidateItems = [];
  for( var i in originalRow ){

    if(originalRow[i] != null)
      continue;
    
    var item = {};
    item.item = i;
    item.score = predictedRow[i];
    candidateItems.push(item);

    if( candidateItems.length == limit )
      break;
  }

  return candidateItems;
}

