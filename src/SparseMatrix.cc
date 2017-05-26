
#include "SparseMatrix.h"

SparseMatrix::SparseMatrix(const v8::Local<v8::Array>& dataset){
  _rows = dataset->Length();
  _cols = dataset->Get(0).As<v8::Array>()->Length();

  _data = std::unordered_map<int, SparseRow>();

  for(size_t i = 0; i < _rows; i++) {
    v8::Local<v8::Array> currentRow = dataset->Get(i).As<v8::Array>();

    SparseRow row;
    for (size_t j = 0; j < _cols; j++) {
      if( currentRow->Get(j)->NumberValue() )
        row.insert({ j, currentRow->Get(j)->NumberValue() });
    }
    _data.insert({ i, row });
  }
}
