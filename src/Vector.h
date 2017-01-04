#pragma once

#include <vector>
#include <iostream>
#include <numeric>
#include <node.h>

class Vector{
  public:

    Vector(const std::vector<double> v);
    Vector(const int size);
    Vector(const v8::Local<v8::Array>& vect);

    v8::Local<v8::Array> convertToLocalArray(v8::Isolate* isolate);

    double operator()(const int i) const {
      return _data[i];
    }

    double& operator()(const int i) {
      return _data[i];
    }

    double sum();

    void print(){
      for( int i = 0; i < size(); i++ ){
        std::cout << " " << _data[i];
      }
      std::cout << std::endl;
      std::cout << std::endl;
    }

    Vector operator+(const Vector& X) const;
    Vector operator*(const double value) const;

    double operator*(const Vector& X) const;

    int size() const{
      return _data.size();
    }

    std::vector<double> const data() {
      return _data;
    }

  private:
    std::vector<double> _data;

};
