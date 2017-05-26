
var jonfon = require('./index');
var Recommender = jonfon.NewEngine;

var inputMatrix = [
    [ 1, 0, 0, 1 ],
    [ 0, 1, 1, 1 ],
    [ 1, 1, 0, 1 ],
    [ 1, 0, 0, 1 ]
]

const ALPHA = 5;
const FACTORS = 5;
const REGULARIZATION = 0.1;
const ITERATIONS = 50;

var model = Recommender.als2(inputMatrix, ALPHA, FACTORS, REGULARIZATION, ITERATIONS, 1);

console.log(model.XY)
