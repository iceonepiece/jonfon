#pragma once

#include <node.h>
#include <vector>
#include <cmath>
#include "Vector.h"
#include <iostream>
#include <stdlib.h>

class Matrix {
  public:
    Matrix(const int rows, const int cols );
    Matrix(const v8::Local<v8::Array>& dataset );
    v8::Local<v8::Array> convertToLocalArray(v8::Isolate* isolate);

    Vector norms();
    void set( int row, Vector v );

    // linear solve helper functions
    static void multline( Matrix& A, Vector& b, int i, double l );
    static void swap( Matrix& A, Vector& b, int i, int j );
    static void addmul( Matrix& A, Vector& b, int i, int j, double l );
    static Vector solve( Matrix& A, Vector& b );

    static Matrix identity( int n ){
      Matrix M(n, n);
      for( int i = 0; i < n; i++ ){
        M(i,i) = 1;
      }
      return M;
    }

    static Matrix random(const unsigned int rows, const unsigned int cols){
      Matrix M(rows, cols);
      for( size_t i = 0; i < rows; i++ ){
        for( size_t j = 0; j < cols; j++ ){
          double val = (rand() % 100) / 100.0;
          M(i,j) = val;
        }
      }
      return M;
    }

    void print(){
      for( size_t i = 0; i < _rows; i++ ){
        for( size_t j = 0; j < _cols; j++ ){
          std::cout << " " << operator()(i,j);
        }
        std::cout << std::endl;
      }
      std::cout << std::endl;
    }

    static Matrix outer( const Vector& a, const Vector& b ){
      unsigned int nA = a.size();
      unsigned int nB = b.size();
      Matrix M(nA, nB);
      for( size_t i = 0; i < nA; i++ ){
        for( size_t j = 0; j < nB; j++ ){
          M(i,j) = a(i) * b(j);
        }
      }
      return M;
    }

    unsigned int rows() const{
      return _rows;
    }

    unsigned int cols() const{
      return _cols;
    }

    Vector operator()(const int row) const {
      std::vector<double>::const_iterator first = _data.begin() + (row * _cols);
      std::vector<double>::const_iterator last = first + _cols;
      std::vector<double> newVec(first, last);
      return Vector(newVec);
    }

    double operator()(const int r, const int c) const {
      return _data[index(r, c)];
    }

    double& operator()(const int r, const int c) {
      return _data[index(r, c)];
    }

    Matrix transpose() const;
    Matrix operator+(const Matrix& X) const;
    Matrix operator*(const Matrix& X) const;
    Matrix operator*(double x) const;

  private:
    unsigned int _rows;
    unsigned int _cols;
    std::vector<double> _data;

    int index(const int r, const int c) const {
      return r * _cols + c;
    }
};
