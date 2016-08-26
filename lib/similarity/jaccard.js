'use strict';

function jaccard(prefs, p1, p2){

  var A = prefs[p1];
  var B = prefs[p2];

  var nA = 0;
  var nB = 0;
  var nAB = 0;

  // assume A and B are equal in length
  for( var i = 0; i < A.length; i++ ){
    nA += A[i];
    nB += B[i];
    nAB += Number(A[i] && B[i]);
  }

  var bot = nA + nB - nAB;

  if( bot == 0 )
    return 0;

  var sim = nAB / ( nA + nB - nAB );

  return  Number( sim.toFixed(4) );
}

module.exports = jaccard;
