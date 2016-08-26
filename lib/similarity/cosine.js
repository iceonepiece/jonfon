'use strict';

function dot(x, y){
  var sum = 0;
  for( var i = 0; i < x.length; i++ ){
    sum += x[i] * y[i];
  }
  return sum;
}

function l2norm(x){
  var sum = 0;
  for( var i = 0; i < x.length; i++ ){
    sum += x[i] * x[i];
  }
  return Math.sqrt(sum);
}

function cosine(prefs, p1, p2){
  var A = prefs[p1];
  var B = prefs[p2];
  var result = dot(A, B) / ( l2norm(A) * l2norm(B) );

  return Number( result.toFixed(4) );
}

module.exports = cosine;
