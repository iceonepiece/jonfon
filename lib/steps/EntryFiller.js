
var _ = require('lodash');

module.exports = EntryFiller;

function EntryFiller(){

}

EntryFiller.prototype.run = function(model){

  console.log('EntryFiller');
  var filledMatrix = _.cloneDeep(model.input);

  for( var i in filledMatrix ){

    var row = filledMatrix[i];
    var nullEntries = [];
    var sum = 0;
    var n = 0;

    for( var j in row ){

      if( row[j] == null ){
        nullEntries.push(j);
      } else{
        sum += row[j];
        n += 1;
      }
    }

    var average = 0;
    if( n != 0 ){
      average = sum / n;
    }

    for( var j in nullEntries ){
      row[ nullEntries[j] ] = average;
    }
  }

  model.addOutput('filledMatrix', filledMatrix);

}
