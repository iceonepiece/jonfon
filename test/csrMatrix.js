
var Recommender = require('../index').NewEngine;
var expect  = require("chai").expect;
const milker = require('milker');
const SparseMatrix = milker.SparseMatrix;

describe('CSR Matrix', function(){
  it('Convert', function(){

    const inputMatrix = [
        [ 1, 0, 2, 1 ],
        [ 0, 3, 4, 9 ],
        [ 5, 1, 2, 1 ],
        [ 2, 0, 0, 7 ]
    ]

    const p = [
      [ 0.00548814,  0.00715189,  0.00602763 ],
      [ 0.00544883,  0.00423655,  0.00645894 ],
      [ 0.00437587,  0.00891773,  0.00963663 ],
      [ 0.00383442,  0.00791725,  0.00528895 ]
    ];

    const q = [
      [ 0.00568045,  0.00925597,  0.00071036 ],
      [ 0.00087129,  0.00020218,  0.0083262  ],
      [ 0.00778157,  0.00870012,  0.00978618 ],
      [ 0.00799159,  0.00461479,  0.00780529 ]
    ];

    const expectedMatrix = [
      [ 1.07722724,  0.19912458,  0.94041075,  0.85149217 ],
      [ 0.15810207,  1.03119159,  0.9799969 ,  0.97964133 ],
      [ 0.94480233,  0.66423415,  1.02970467,  1.23778673 ],
      [ 1.00648547,  0.08356804,  0.02846537,  0.97956352 ],
    ];

    const ROWS = 3;
    const COLS = 4;
    const FACTORS = 3;
    const REGULARIZATION = 0.1;
    const ITERATIONS = 50;
    const sparseMatrix = new SparseMatrix(inputMatrix);

    var toSendSparseMatrix = sparseMatrix.elements();
    toSendSparseMatrix.rows = sparseMatrix.rows();
    toSendSparseMatrix.cols = sparseMatrix.cols();

    const model = Recommender.testCsr(toSendSparseMatrix, p, q, REGULARIZATION, ITERATIONS);

    for( var i = 0; i < ROWS; i++ ){
      for( var j = 0; j < COLS; j++ ){
        expect(model[i][j].toFixed(8)).to.equal(expectedMatrix[i][j].toFixed(8));
      }
    }
  });

  it('transpose()', function(){

    const inputMatrix = [
      [ 9,  0, 0 ],
      [ 0, 11, 0 ],
      [ 1,  1, 0 ],
      [ 1,  0, 0 ]
    ];

    var sparseA = new SparseMatrix(inputMatrix);
    var sparseAt = sparseA.transpose();

    var toSendSparseMatrix = sparseA.elements();
    toSendSparseMatrix.rows = sparseA.rows();
    toSendSparseMatrix.cols = sparseA.cols();

    const result = Recommender.csrTranpose(toSendSparseMatrix);
    expect(sparseAt.elements()).to.deep.equal(result);

  });



});
