
#include "Vector.h"

Vector::Vector(const std::vector<double> v):
  _data(v){
}

Vector::Vector(const int size):
  _data(size, 0.0){
}

Vector::Vector(const v8::Local<v8::Array>& vect){
  int length = vect->Length();
  std::vector<double> newData(vect->Length(), 0.0);

  for( int i = 0; i < length; i++) {
    newData[i] = vect->Get(i)->NumberValue();
  }
  _data = newData;
}

v8::Local<v8::Array> Vector::convertToLocalArray(v8::Isolate* isolate){
  v8::Local<v8::Array> m = v8::Array::New(isolate, _data.size());

  for (size_t i = 0; i < _data.size(); i++) {
    m->Set(i, v8::Number::New(isolate, _data[i]));
  }
  return m;
}

Vector Vector::operator+(const Vector& X) const{
  int size = X.size();
  std::vector<double> V(size, 0.0);
  for( int i = 0; i < size; i++ ){
    V[i] = operator()(i) + X(i);
  }
  return Vector(V);
}

double Vector::sum(){
  return std::accumulate(_data.begin(), _data.end(), 0);
}

Vector Vector::operator*(const double value) const{
  std::vector<double> V(_data.size(), 0.0);
  for(size_t i = 0; i < _data.size(); i++ ){
    V[i] = operator()(i) * value;
  }
  return Vector(V);
}

double Vector::operator*(const Vector& X) const{
  double sum = 0;
  for(size_t i = 0; i < _data.size(); i++ ){
    sum += operator()(i) * X(i);
  }
  return sum;
}
