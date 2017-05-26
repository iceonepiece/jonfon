#pragma once

#include <node.h>
#include <unordered_map>

typedef std::unordered_map<int, double> SparseRow;

class SparseMatrix {
  public:
    SparseMatrix(const v8::Local<v8::Array>& dataset );

    unsigned int rows() const { return _rows; }
    unsigned int cols() const { return _cols; }

    SparseRow operator()(const int row) const {
      return _data.find(row)->second;
    }

  private:
    unsigned int _rows;
    unsigned int _cols;
    std::unordered_map<int, SparseRow> _data;

};
