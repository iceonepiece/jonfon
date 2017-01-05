#include <node.h>
#include <stdlib.h>
#include <iostream>
#include <iomanip>
#include <numeric>
#include <time.h>
#include <math.h>
#include <vector>
#include "Vector.h"
#include "Matrix.h"

using namespace std;

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Array;
using v8::Number;

void solver( Matrix& Cui, Matrix& X, Matrix& Y, double regularization){

  int users = X.rows();
  int factors = X.cols();
  Matrix YtY = Y.transpose() * Y;

  for( int u = 0; u < users; u++ ){

    Matrix A = YtY + ( Matrix::identity(factors) * regularization );
    Vector b(factors);

    for( int i = 0; i < Cui.cols(); i++ ){

      double confidence = Cui(u,i);
      if(confidence == 0 ){
        continue;
      }
      Vector factor = Y(i);
      A = A + ( Matrix::outer(factor, factor) * (confidence - 1) );
      b = b + ( factor * confidence );
    }
    X.set(u, Matrix::solve(A, b));
  }
}

void Als(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Array> dataset = Local<Array>::Cast(args[0]);
  Local<Array> P = Local<Array>::Cast(args[1]);
  Local<Array> Q = Local<Array>::Cast(args[2]);

  double regularization = args[3]->NumberValue();
  int iterations = args[4]->IntegerValue();

  Matrix X(P);
  Matrix Y(Q);
  Matrix Cui(dataset);

  Matrix Ciu = Cui.transpose();

  for( int i = 0; i < iterations; i++ ){
    solver(Cui, X, Y, regularization);
    solver(Ciu, Y, X, regularization);
  }

  Matrix result = X * Y.transpose();
  args.GetReturnValue().Set(result.convertToLocalArray(isolate));
}

void Als2(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Array> dataset = Local<Array>::Cast(args[0]);
  Matrix ratingMatrix(dataset);
  int rows = ratingMatrix.rows();
  int cols = ratingMatrix.cols();

  double ALPHA = args[1]->NumberValue();
  int FACTORS = args[2]->IntegerValue();
  double REGULARIZATION = args[3]->NumberValue();
  int ITERATIONS = args[4]->IntegerValue();

  if( args[5]->IsNumber() ){
    srand(args[5]->IntegerValue());
  } else{
    srand(time(NULL));
  }

  ratingMatrix = ratingMatrix * ALPHA;
  Matrix X = Matrix::random(rows, FACTORS);
  Matrix Y = Matrix::random(cols, FACTORS);

  Matrix transposeRatingMatrix = ratingMatrix.transpose();

  for( int i = 0; i < ITERATIONS; i++ ){
    solver(ratingMatrix, X, Y, REGULARIZATION);
    solver(transposeRatingMatrix, Y, X, REGULARIZATION);
  }

  Local<Object> res = Object::New(isolate);
  Matrix result = X * Y.transpose();

  res->Set(String::NewFromUtf8(isolate, "X"), X.convertToLocalArray(isolate));
  res->Set(String::NewFromUtf8(isolate, "Y"), Y.convertToLocalArray(isolate));
  res->Set(String::NewFromUtf8(isolate, "XY"), result.convertToLocalArray(isolate));

  args.GetReturnValue().Set(res);
}

double mean( vector<double>& vect ){
  double total = 0;
  for( size_t i = 0; i < vect.size(); i++ ){
    total += vect[i];
  }

  return total / vect.size();
}

void Bm25(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Array> dataset = Local<Array>::Cast(args[0]);
  Matrix X(dataset);

  const int N = X.rows();
  double K1 = args[1]->NumberValue();
  double B = args[2]->NumberValue();

  vector<size_t> xCol;
  for( int i = 0; i < N; i++ ){
    for( int j = 0; j < X.cols(); j++ ){
      if( X(i, j) > 0 ){
        xCol.push_back(j);
      }
    }
  }

  vector<double> idf(X.cols());
  for( size_t i = 0; i < idf.size(); i++ ){
    int num = 0;
    for( size_t j = 0; j < xCol.size(); j++ ){
      if( xCol[j] == i ){
        num += 1;
      }
    }
    idf[i] = log( double(N) / (num + 1) );
  }

  vector<double> rowSums(N);
  for( int i = 0; i < N; i++ ){
    Vector vect = X(i);
    rowSums[i] = vect.sum();
  }

  double averageLength = mean(rowSums);

  vector<double> lengthNorm(N);
  for( int i = 0; i < N; i++ ){
    lengthNorm[i] = (1.0 - B) + B *  rowSums[i] / averageLength;
  }

  for( int i = 0; i < N; i++ ){
    for( int j = 0; j < X.cols(); j++ ){
      X(i,j) = X(i,j) * (K1 + 1.0) / (K1 * lengthNorm[i] + X(i,j)) * idf[j];
      if( isnan( X(i,j) ) ){
        X(i, j) = 0;
      }
    }
  }

  args.GetReturnValue().Set(X.convertToLocalArray(isolate));
}

void Cosine(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Matrix X(Local<Array>::Cast(args[0]));

  Vector norms = X.norms();

  for( size_t i = 0; i < X.rows(); i++ ){
    for( size_t j = 0; j < X.cols(); j++ ){
      X(i, j) = X(i, j) / norms(i);
    }
  }

  Matrix model(X.rows(), X.cols());
  for( size_t i = 0; i < X.rows(); i++ ){
    for( size_t j = 0; j < X.cols(); j++ ){
      model(i, j) = X(i) * X(j);
    }
  }

  args.GetReturnValue().Set(model.convertToLocalArray(isolate));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "bm25", Bm25);
  NODE_SET_METHOD(exports, "als", Als);
  NODE_SET_METHOD(exports, "als2", Als2);
  NODE_SET_METHOD(exports, "cosine", Cosine);
}

NODE_MODULE(addon, init)

}  // namespace demo
