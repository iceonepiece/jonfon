#include "CsrMatrix.h"

CsrMatrix::CsrMatrix(
  std::vector<double> values,
  std::vector<size_t> rowPointers,
  std::vector<size_t> columnIndices,
  size_t rows, size_t cols
): _rows(rows), _cols(cols){
  _values = values;
  _rowPointers = rowPointers;
  _columnIndices = columnIndices;
}

CsrMatrix::CsrMatrix(const v8::Local<v8::Object>& dataset, v8::Isolate* isolate){

  v8::Local<v8::Array> vals = v8::Local<v8::Array>::Cast(
    dataset->Get(v8::String::NewFromUtf8(isolate,"values")));

  v8::Local<v8::Array> colIndices = v8::Local<v8::Array>::Cast(
    dataset->Get(v8::String::NewFromUtf8(isolate,"columnIndices")));

  v8::Local<v8::Array> rowPointers = v8::Local<v8::Array>::Cast(
    dataset->Get(v8::String::NewFromUtf8(isolate,"rowPointers")));

  _rows = dataset->Get(v8::String::NewFromUtf8(isolate,"rows"))->IntegerValue();
  _cols = dataset->Get(v8::String::NewFromUtf8(isolate,"cols"))->IntegerValue();

  size_t nVals = vals->Length();
  size_t nColIndices = colIndices->Length();
  size_t nRowPointers = rowPointers->Length();

  for(size_t i = 0; i < nVals; i++){
    _values.push_back(vals->Get(i)->NumberValue());
  }

  for(size_t i = 0; i < nColIndices; i++){
    _columnIndices.push_back(colIndices->Get(i)->IntegerValue());
  }

  for(size_t i = 0; i < nRowPointers; i++){
    _rowPointers.push_back(rowPointers->Get(i)->IntegerValue());
  }
}

v8::Local<v8::Object> CsrMatrix::convertToLocalArray(v8::Isolate* isolate){
  v8::Local<v8::Object> res = v8::Object::New(isolate);

  v8::Local<v8::Array> vals = v8::Array::New(isolate, _values.size());
  for(size_t i = 0; i < _values.size(); i++){
    vals->Set(i, v8::Number::New(isolate, _values[i]));
  }

  v8::Local<v8::Array> colIndices = v8::Array::New(isolate, _columnIndices.size());
  for(size_t i = 0; i < _columnIndices.size(); i++){
    colIndices->Set(i, v8::Number::New(isolate, _columnIndices[i]));
  }

  v8::Local<v8::Array> rowPointers = v8::Array::New(isolate, _rowPointers.size());
  for(size_t i = 0; i < _rowPointers.size(); i++){
    rowPointers->Set(i, v8::Number::New(isolate, _rowPointers[i]));
  }

  res->Set(v8::String::NewFromUtf8(isolate, "values"), vals);
  res->Set(v8::String::NewFromUtf8(isolate, "columnIndices"), colIndices);
  res->Set(v8::String::NewFromUtf8(isolate, "rowPointers"), rowPointers);

  return res;
}

std::vector< std::tuple<size_t, double> > CsrMatrix::get(size_t row){
  std::vector< std::tuple<size_t, double> > elements;

  for(size_t i = _rowPointers[row]; i < _rowPointers[row + 1]; i++){
    elements.push_back(std::make_tuple(_columnIndices[i], _values[i]));
  }
  return elements;
}

CsrMatrix CsrMatrix::transpose() const{

  size_t newRows = _cols;
  size_t newCols = _rows;

  std::vector<size_t> newRowPointers;
  for(size_t i = 0; i < newRows + 1; i++){
    newRowPointers.push_back(0);
  }

  for(size_t i = 0; i < _columnIndices.size(); i++){
    newRowPointers[_columnIndices[i] + 1] += 1;
  }

  for(size_t i = 1; i < newRowPointers.size(); i++){
    newRowPointers[i] += newRowPointers[i - 1];
  }

  std::vector<size_t> newColumnIndices(_columnIndices.size());
  std::vector<double> newValues(_values.size());
  std::unordered_map<size_t, size_t> offsetTable;

  for(size_t i = 0; i < _rows; i++){
    for(size_t j = _rowPointers[i]; j < _rowPointers[i+1]; j++){
      size_t rowIndex = _columnIndices[j];
      size_t colIndex = i;
      double value = _values[j];

      auto iter = offsetTable.find(rowIndex);
      if( iter == offsetTable.end() ){
        offsetTable.insert({ rowIndex, 0 });
      }

      size_t continueIndex = offsetTable.find(rowIndex)->second;
      size_t toStoreIndex = newRowPointers[rowIndex] + continueIndex;
      newColumnIndices[toStoreIndex] = colIndex;
      newValues[toStoreIndex] = value;
      offsetTable[rowIndex] = continueIndex + 1;

    }
  }

  CsrMatrix result(newValues, newRowPointers, newColumnIndices, newRows, newCols);

  return result;
}
