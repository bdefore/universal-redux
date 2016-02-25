'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (store, renderProps, providers) {
  var server = _reduxAsyncConnect2.default;
  if ((0, _lodash.includes)(providers, 'async-props')) {
    server = _asyncProps2.default;
  }
  if ((0, _lodash.includes)(providers, 'redux-async-connect')) {
    server = _reduxAsyncConnect2.default;
  }
  return server(store, renderProps);
};

var _lodash = require('lodash');

var _reduxAsyncConnect = require('./providers/redux-async-connect');

var _reduxAsyncConnect2 = _interopRequireDefault(_reduxAsyncConnect);

var _asyncProps = require('./providers/async-props');

var _asyncProps2 = _interopRequireDefault(_asyncProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }