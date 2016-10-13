'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (store, renderProps) {
  return new _promise2.default(function (resolve, reject) {
    (0, _asyncProps.loadPropsOnServer)(renderProps, function (err, asyncProps) {
      if (err) {
        reject(err);
      }
      var root = _react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_asyncProps2.default, (0, _extends3.default)({}, renderProps, asyncProps))
        )
      );
      resolve(root);
    });
  });
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _asyncProps = require('../../vendor/async-props');

var _asyncProps2 = _interopRequireDefault(_asyncProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }