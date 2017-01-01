
#include "Matrix.h"

Matrix::Matrix(const int rows, const int cols)
  : _rows(rows), _cols(cols), _data(rows * cols, 0.0){
}

void Matrix::multline( Matrix& A, Vector& b, int i, double l ){

  b(i) *= l;
  for( int k = A.cols() - 1; k >= 0; k-- ){
    A(i, k) *= l;
  }
}

void Matrix::set( int row, Vector v ){
  int offset = row * _cols;
  for( int i = 0; i < _cols; i++ ){
    _data[i + offset] = v(i);
  }
}

void Matrix::swap( Matrix& A, Vector& b, int i, int j ){
  double tmp = b(i);
  b(i) = b(j);
  b(j) = tmp;

  Vector vTmp = A(i);
  A.set(i, A(j));
  A.set(j, vTmp);
}


void Matrix::addmul( Matrix& A, Vector& b, int i, int j, double l ){

  b(i) = b(i) + (l * b(j));

  Vector lineI = A(i);
  Vector lineJ = A(j);

  for(int k = lineI.size() - 1; k >= 0; k-- ){
    lineI(k) = lineI(k) + ( l * lineJ(k) );
  }
  A.set(i, lineI);
}

Vector Matrix::solve( Matrix& A, Vector& b){

  int pivot = 0;
  int lines = A.rows();
  int columns = A.cols();
  std::vector<double> nullLines;

  for( int j = 0; j < columns; j++ ){
    double maxValue = 0;
    int maxLine = 0;

    for( int k = pivot; k < lines; k++ ){
      double val = A(k,j);
      if( std::abs(val) > std::abs(maxValue) ){
        maxLine = k;
        maxValue = val;
      }
    }

    if( maxValue == 0 ){
      nullLines.push_back(pivot);
    } else{

      multline(A, b, maxLine, 1.0/maxValue);
      swap(A, b, maxLine, pivot);

      for (int i = 0; i < lines; i++ ){
        if (i != pivot) {
          addmul(A, b, i, pivot, -A(i,j));
        }
      }
    }
    pivot++;
  }
  return b;
}


Matrix::Matrix(const v8::Local<v8::Array>& dataset){
  _rows = dataset->Length();
  _cols = dataset->Get(0).As<v8::Array>()->Length();
  _data = std::vector<double>(_rows * _cols, 0.0);

  for( int i = 0; i < _rows; i++) {
    v8::Local<v8::Array> currentRow = dataset->Get(i).As<v8::Array>();
    for (int j = 0; j < _cols; j++) {
        operator()(i,j) = currentRow->Get(j)->NumberValue();
    }
  }
}

v8::Local<v8::Array> Matrix::convertToLocalArray(v8::Isolate* isolate){
  v8::Local<v8::Array> m = v8::Array::New(isolate, _rows);

  for (int i = 0; i < _rows; i++) {
    v8::Local<v8::Array> row = v8::Array::New(isolate, _cols);
    for (int j = 0; j < _cols; j++) {
      row->Set(j, v8::Number::New(isolate, operator()(i,j)));
    }
    m->Set(i, row);
  }
  return m;
}

Matrix Matrix::operator+(const Matrix& X) const{
  Matrix M(_rows, _cols);
  for(int i = 0; i < _rows; i++) {
    for (int j = 0; j < _cols; j++) {
      M(i, j) = operator()(i, j) + X(i, j);
    }
  }
  return M;
}

Matrix Matrix::operator*(const Matrix& X) const{
  Matrix M(_rows, X.cols());

  for( int i = 0; i < _rows; i++ ){
    for( int j = 0; j < X.cols(); j++ ){
      double sum = 0;
      for( int k = 0; k < _cols; k++ ){
        sum += operator()(i,k) * X(k,j);
      }
      M(i, j) = sum;
    }
  }
  return M;
}

Matrix Matrix::operator*( double x ) const{
  Matrix M(_rows, _cols);

  for( int i = 0; i < _rows; i++ ){
    for( int j = 0; j < _cols; j++ ){
      M(i, j) = operator()(i,j) * x;
    }
  }
  return M;
}

Matrix Matrix::transpose() const{
  Matrix M(_cols, _rows);
  for( int i = 0; i < _rows; i++ ){
    for( int j = 0; j < _cols; j++ ){
      M(j, i) = operator()(i,j);
    }
  }
  return M;
}
