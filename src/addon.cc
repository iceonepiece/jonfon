#include <node.h>
#include <stdlib.h>
#include <iostream>
#include <iomanip>
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

  Matrix result = X * Y.transpose();
  args.GetReturnValue().Set(result.convertToLocalArray(isolate));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "als", Als);
  NODE_SET_METHOD(exports, "als2", Als2);
}

NODE_MODULE(addon, init)

}  // namespace demo
