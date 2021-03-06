#include <node.h>
#include <stdlib.h>
#include <iostream>
#include <tuple>
#include <iomanip>
#include <numeric>
#include <time.h>
#include <math.h>
#include <vector>
#include "Vector.h"
#include "SparseMatrix.h"
#include "Matrix.h"
#include "CsrMatrix.h"

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

typedef std::unordered_map<int, double> SparseRow;

void newSolver( CsrMatrix& Cui, Matrix& X, Matrix& Y, double regularization){

  int users = X.rows();
  int factors = X.cols();
  Matrix YtY = Y.transpose() * Y;

  for( int u = 0; u < users; u++ ){
    Matrix A = YtY + ( Matrix::identity(factors) * regularization );
    Vector b(factors);

    vector< tuple<size_t, double> > thisRow = Cui.get(u);

    for(size_t i = 0; i < thisRow.size(); i++ ){
      size_t colIndex = get<0>(thisRow[i]);
      double confidence = get<1>(thisRow[i]);

      Vector factor = Y(colIndex);
      A = A + ( Matrix::outer(factor, factor) * (confidence - 1) );
      b = b + ( factor * confidence );
    }
    X.set(u, Matrix::solve(A, b));

  }
}

void solver( Matrix& Cui, Matrix& X, Matrix& Y, double regularization){

  int users = X.rows();
  int factors = X.cols();
  Matrix YtY = Y.transpose() * Y;

  for( int u = 0; u < users; u++ ){

    Matrix A = YtY + ( Matrix::identity(factors) * regularization );
    Vector b(factors);

    for(size_t i = 0; i < Cui.cols(); i++ ){

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

  const unsigned int N = X.rows();
  double K1 = args[1]->NumberValue();
  double B = args[2]->NumberValue();

  vector<size_t> xCol;
  for(size_t i = 0; i < N; i++ ){
    for(size_t j = 0; j < X.cols(); j++ ){
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
  for( size_t i = 0; i < N; i++ ){
    Vector vect = X(i);
    rowSums[i] = vect.sum();
  }

  double averageLength = mean(rowSums);

  vector<double> lengthNorm(N);
  for( size_t i = 0; i < N; i++ ){
    lengthNorm[i] = (1.0 - B) + B *  rowSums[i] / averageLength;
  }

  for( size_t i = 0; i < N; i++ ){
    for( size_t j = 0; j < X.cols(); j++ ){
      X(i,j) = X(i,j) * (K1 + 1.0) / (K1 * lengthNorm[i] + X(i,j)) * idf[j];
      if( std::isnan( X(i,j) ) ){
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
      if( std::isnan( X(i, j) ) ){
        X(i, j) = 0;
      }
    }
  }

  Matrix model(X.rows(), X.rows());
  for( size_t i = 0; i < X.rows(); i++ ){
    for( size_t j = 0; j < X.rows(); j++ ){
      model(i, j) = X(i) * X(j);
    }
  }

  args.GetReturnValue().Set(model.convertToLocalArray(isolate));
}

double calculateNewJaccard( Vector A, Vector B ) {

  double top = 0;
  double bot = 0;

  for( size_t i = 0; i < A.size(); i++ ){

    if( A(i) > 0 || B(i) > 0 ){
      bot += 1;
    }

    if( A(i) > 0 && B(i) > 0 ){
      double val = 1;

      if( A(i) != B(i) )
        val = 0.5;

      top += val;
    }
  }

  if( bot == 0 || top == 0 )
    return 0;

  return top / bot;
}

void calculateJaccard(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Vector A(Local<Array>::Cast(args[0]));
  Vector B(Local<Array>::Cast(args[1]));

  double top = 0;
  double bot = 0;

  for (size_t i = 0; i < A.size(); i++) {
    if (A(i) > 0 || B(i) > 0) {
      bot += 1;
    }

    if (A(i) > 0 && B(i) > 0) {
      double val = 1;
      if (A(i) != B(i))
        val = 0.5;
      top += val;
    }
  }

  Local<Object> res = Object::New(isolate);
  res->Set(String::NewFromUtf8(isolate, "top"), Number::New(isolate, top));
  res->Set(String::NewFromUtf8(isolate, "bot"), Number::New(isolate, bot));
  args.GetReturnValue().Set(res);
}

double calculateNewJaccard( SparseRow A, SparseRow B ) {

  double same = 0;
  double top = 0;

  for( auto aIter = A.begin(); aIter != A.end(); ++aIter ){
    auto bIter = B.find(aIter->first);

    if( bIter != B.end() ){
      same += 1;
      double val = 1;
      if( aIter->second != bIter->second )
        val = 0.5;
      top += val;
    }
  }

  double bot = A.size() + B.size() - same;

  if( bot == 0 || top == 0 )
    return 0;

  return top / bot;
}


void NewJaccard(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Matrix X(Local<Array>::Cast(args[0]));

  Matrix model(X.rows(), X.rows());
  for( size_t i = 0; i < X.rows(); i++ ){
    for( size_t j = i; j < X.rows(); j++ ){
      if( i == j )model(i, j) = 1;
      else{
        double similarity = calculateNewJaccard( X(i), X(j) );
        model(i, j) = similarity;
        model(j, i) = similarity;
      }
    }
  }

  args.GetReturnValue().Set(model.convertToLocalArray(isolate));
}


void NewJaccard2(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  SparseMatrix X(Local<Array>::Cast(args[0]));

  Matrix model(X.rows(), X.rows());

  for( size_t i = 0; i < X.rows(); i++ ){
    for( size_t j = i; j < X.rows(); j++ ){
      if(i == j) model(i, j) = 1;
      else{
        double similarity = calculateNewJaccard( X(i), X(j) );
        model(i, j) = similarity;
        model(j, i) = similarity;
      }
    }
  }

  args.GetReturnValue().Set(model.convertToLocalArray(isolate));
}

void csrTranpose(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Object> dataset = Local<Object>::Cast(args[0]);

  CsrMatrix X(dataset, isolate);
  CsrMatrix Xt = X.transpose();

  args.GetReturnValue().Set(Xt.convertToLocalArray(isolate));
}

void testCsr(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Object> dataset = Local<Object>::Cast(args[0]);
  Local<Array> P = Local<Array>::Cast(args[1]);
  Local<Array> Q = Local<Array>::Cast(args[2]);

  double regularization = args[3]->NumberValue();
  int iterations = args[4]->IntegerValue();

  Matrix X(P);
  Matrix Y(Q);
  CsrMatrix Cui(dataset, isolate);
  CsrMatrix Ciu = Cui.transpose();

  for( int i = 0; i < iterations; i++ ){
    newSolver(Cui, X, Y, regularization);
    newSolver(Ciu, Y, X, regularization);
  }

  Matrix result = X * Y.transpose();
  args.GetReturnValue().Set(result.convertToLocalArray(isolate));
}

void newAls(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Object> dataset = Local<Object>::Cast(args[0]);
  CsrMatrix ratingMatrix(dataset, isolate);
  size_t rows = ratingMatrix.rows();
  size_t cols = ratingMatrix.cols();

  double ALPHA = args[1]->NumberValue();
  int FACTORS = args[2]->IntegerValue();
  double REGULARIZATION = args[3]->NumberValue();
  int ITERATIONS = args[4]->IntegerValue();

  if( args[5]->IsNumber() ){
    srand(args[5]->IntegerValue());
  } else{
    srand(time(NULL));
  }

  //ratingMatrix = ratingMatrix * ALPHA;
  Matrix X = Matrix::random(rows, FACTORS);
  Matrix Y = Matrix::random(cols, FACTORS);

  CsrMatrix tRatingMatrix = ratingMatrix.transpose();

  for( int i = 0; i < ITERATIONS; i++ ){
    newSolver(ratingMatrix, X, Y, REGULARIZATION);
    newSolver(tRatingMatrix, Y, X, REGULARIZATION);
  }

  Local<Object> res = Object::New(isolate);
  Matrix result = X * Y.transpose();

  res->Set(String::NewFromUtf8(isolate, "X"), X.convertToLocalArray(isolate));
  res->Set(String::NewFromUtf8(isolate, "Y"), Y.convertToLocalArray(isolate));
  res->Set(String::NewFromUtf8(isolate, "XY"), result.convertToLocalArray(isolate));

  args.GetReturnValue().Set(res);
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "bm25", Bm25);
  NODE_SET_METHOD(exports, "als", Als);
  NODE_SET_METHOD(exports, "als2", Als2);
  NODE_SET_METHOD(exports, "cosine", Cosine);
  NODE_SET_METHOD(exports, "newJaccard", NewJaccard);
  NODE_SET_METHOD(exports, "newJaccard2", NewJaccard2);
  NODE_SET_METHOD(exports, "calculateJaccard", calculateJaccard);

  NODE_SET_METHOD(exports, "newAls", newAls);
  NODE_SET_METHOD(exports, "testCsr", testCsr);
  NODE_SET_METHOD(exports, "csrTranpose", csrTranpose);
}

NODE_MODULE(addon, init)

}  // namespace demo
