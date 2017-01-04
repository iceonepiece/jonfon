
var Recommender = require('../index').NewEngine;
var expect  = require("chai").expect;

const testMatrix_1 = [
  [ 0, 0, 0 ],
  [ 0, 0, 0 ],
  [ 0, 0, 0 ]
];

const testMatrix_2 = [
  [ 1, 0, 0 ],
  [ 0, 2, 0 ],
  [ 0, 0, 3 ]
];

const testMatrix_3 = [
  [1, 0, 0, 0, 0],
  [7, 2, 0, 0, 0],
  [8, 6, 3, 0, 0],
  [0, 9, 5, 4, 0]
]

const weightedMatrix_1 = [
  [ 0, 0, 0 ],
  [ 0, 0, 0 ],
  [ 0, 0, 0 ]
];

const weightedMatrix_2 = [
  [ 0.67134387,  0.        ,  0.         ],
  [ 0.        ,  0.80297992,  0.         ],
  [ 0.        ,  0.        ,  0.85913236 ]
];

const weightedMatrix_3 = [
  [ 0., 0., 0.         ,0.         ,0. ],
  [ 0., 0., 0.         ,0.         ,0. ],
  [ 0., 0., 0.60579846 ,0.         ,0. ],
  [ 0., 0., 0.94953887 ,1.84231224 ,0. ],
];

var testMatrices = [ testMatrix_1, testMatrix_2, testMatrix_3 ];
var weightedMatrices = [ weightedMatrix_1, weightedMatrix_2, weightedMatrix_3 ];
var nTests = testMatrices.length;

describe('-- BM25 Weight --', function(){

  it('should get the same result', function(){

    for( var k = 0; k < nTests; k++ ){

      const testMatrix = testMatrices[k];
      const weightedMatrix = weightedMatrices[k];
      const ROWS = testMatrix.length;
      const COLS = testMatrix[0].length;

      resultMatrix = Recommender.bm25(testMatrix, 100, 0.8);

      for( var i = 0; i < ROWS; i++ ){
        for( var j = 0; j < COLS; j++ ){
          expect(resultMatrix[i][j].toFixed(8)).to.equal(weightedMatrix[i][j].toFixed(8));
        }
      }

    }
  });
});
