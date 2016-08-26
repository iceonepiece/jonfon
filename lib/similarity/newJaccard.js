'use strict';

function newJaccard(prefs, p1, p2){

  var A = prefs[p1];
  var B = prefs[p2];

  var top = 0;
  var bot = 0;

  for( var i = 0; i < A.length; i++ ){

    if( A[i] > 0 || B[i] > 0 ){
      bot += 1;
    }

    if( A[i] > 0 && B[i] > 0 ){
      var val = 1;

      if( A[i] != B[i] )
        val = 0.5;

      top += val;
    }
  }

  if( bot == 0 || top == 0 )
    return 0;

  var sim = top / bot;

  return  Number( sim.toFixed(4) );
}

module.exports = newJaccard;
