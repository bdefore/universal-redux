'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (store, renderProps) {
  return new _promise2.default(function (resolve, reject) {
    (0, _reduxAsyncConnect.loadOnServer)(renderProps, store).then(function () {
      var root = _react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_reduxAsyncConnect.ReduxAsyncConnect, renderProps)
        )
      );
      resolve(root);
    }).catch(function (err) {
      reject(err);
    });
  });
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reduxAsyncConnect = require('redux-async-connect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }