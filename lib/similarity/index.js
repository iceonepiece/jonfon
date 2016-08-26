'use strict';

const jaccard     = require('./jaccard');
const newJaccard  = require('./newJaccard');
const pearson     = require('./pearson');
const cosine      = require('./cosine');

module.exports = {
  jaccard,
  newJaccard,
  pearson,
  cosine,
};
