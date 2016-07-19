module.exports = {
  pearson: pearson,
  jaccard: jaccard
}

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
  console.log('SIM: ', nA, nB, nAB, sim);

  return  Number( sim.toFixed(4) );
}

function pearson(prefs, p1, p2) {

  var si = [];

  for (var key in prefs[p1]) {
    if (prefs[p2][key]) si.push(key);
  }

  var n = si.length;

  if (n == 0) return 0;

  var sum1 = 0;
  for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];

  var sum2 = 0;
  for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];

  var sum1Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum1Sq += Math.pow(prefs[p1][si[i]], 2);
  }

  var sum2Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum2Sq += Math.pow(prefs[p2][si[i]], 2);
  }

  var pSum = 0;
  for (var i = 0; i < si.length; i++) {
    pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
  }

  var num = pSum - (sum1 * sum2 / n);
  var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
      (sum2Sq - Math.pow(sum2, 2) / n));

  if (den == 0) return 0;

  return Number( (num / den).toFixed(4) );
}