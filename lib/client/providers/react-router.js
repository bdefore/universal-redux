'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (store) {
  var component = _react2.default.createElement(
    _reactRouter.Router,
    { render: function render(props) {
        return _react2.default.createElement(_reduxAsyncConnect.ReduxAsyncConnect, props);
      }, history: _reactRouter.browserHistory },
    (0, _routes2.default)(store)
  );

  return component;
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reduxAsyncConnect = require('redux-async-connect');

var _routes = require('universal-redux/routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }