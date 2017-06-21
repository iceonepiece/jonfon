#pragma once

#include <node.h>
#include <vector>
#include <tuple>
#include <iostream>
#include <unordered_map>

class CsrMatrix {
  public:
    CsrMatrix(const v8::Local<v8::Object>& dataset, v8::Isolate* isolate);
    CsrMatrix(
      std::vector<double> values,
      std::vector<size_t> rowPointers,
      std::vector<size_t> columnIndices,
      size_t rows, size_t cols
    );

    std::vector< std::tuple<size_t, double> > get(size_t row);

    size_t rows() const { return _rows; }
    size_t cols() const { return _cols; }

    v8::Local<v8::Object> convertToLocalArray(v8::Isolate* isolate);
    CsrMatrix transpose() const;

  private:
    size_t _rows;
    size_t _cols;
    std::vector<double> _values;
		std::vector<size_t> _rowPointers;
    std::vector<size_t> _columnIndices;

};
