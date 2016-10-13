'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (store, providers, devComponent) {
  var client = _reduxAsyncConnect2.default;
  if ((0, _lodash.includes)(providers, 'async-props')) {
    client = _asyncProps2.default;
  }
  if ((0, _lodash.includes)(providers, 'redux-async-connect')) {
    client = _reduxAsyncConnect2.default;
  }

  return client(store, devComponent);
};

var _lodash = require('lodash');

var _reduxAsyncConnect = require('./providers/redux-async-connect');

var _reduxAsyncConnect2 = _interopRequireDefault(_reduxAsyncConnect);

var _asyncProps = require('./providers/async-props');

var _asyncProps2 = _interopRequireDefault(_asyncProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }