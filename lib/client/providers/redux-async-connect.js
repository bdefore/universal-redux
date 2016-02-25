'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (store, devComponent) {
  var root = _react2.default.createElement(
    _reactRedux.Provider,
    { store: store, key: 'provider' },
    _react2.default.createElement(
      'div',
      null,
      (0, _reactRouter2.default)(store),
      devComponent
    )
  );

  return _promise2.default.resolve(root);
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactRouter = require('./react-router');

var _reactRouter2 = _interopRequireDefault(_reactRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }