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
      _react2.default.createElement(
        _reactRouter.Router,
        { render: function render(props) {
            return _react2.default.createElement(_asyncProps2.default, props);
          }, history: history },
        (0, _routes2.default)(store)
      ),
      devComponent
    )
  );

  return _promise2.default.resolve(root);
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactRouter = require('react-router');

var _routes = require('universal-redux/routes');

var _routes2 = _interopRequireDefault(_routes);

var _asyncProps = require('../../vendor/async-props');

var _asyncProps2 = _interopRequireDefault(_asyncProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }