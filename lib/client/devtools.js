'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvisibleDevTools = exports.DevTools = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.compose = compose;
exports.listenToRouter = listenToRouter;
exports.render = render;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reduxDevtools = require('redux-devtools');

var _reduxDevtoolsLogMonitor = require('redux-devtools-log-monitor');

var _reduxDevtoolsLogMonitor2 = _interopRequireDefault(_reduxDevtoolsLogMonitor);

var _reduxDevtoolsDockMonitor = require('redux-devtools-dock-monitor');

var _reduxDevtoolsDockMonitor2 = _interopRequireDefault(_reduxDevtoolsDockMonitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DevTools = exports.DevTools = (0, _reduxDevtools.createDevTools)(_react2.default.createElement(
  _reduxDevtoolsDockMonitor2.default,
  { toggleVisibilityKey: 'ctrl-h', changePositionKey: 'ctrl-q' },
  _react2.default.createElement(_reduxDevtoolsLogMonitor2.default, null)
));

var InvisibleDevTools = exports.InvisibleDevTools = (0, _reduxDevtools.createDevTools)(_react2.default.createElement(
  _reduxDevtoolsDockMonitor2.default,
  { defaultIsVisible: false, toggleVisibilityKey: 'ctrl-h', changePositionKey: 'ctrl-q' },
  _react2.default.createElement(_reduxDevtoolsLogMonitor2.default, null)
));

function compose(middleware) {
  var Tools = __DEVTOOLS_IS_VISIBLE__ ? DevTools : InvisibleDevTools;
  return (0, _redux.compose)(_redux.applyMiddleware.apply(undefined, (0, _toConsumableArray3.default)(middleware)), window.devToolsExtension ? window.devToolsExtension() : Tools.instrument(), (0, _reduxDevtools.persistState)(window.location.href.match(/[?&]debug_session=([^&]+)\b/)));
}

// context: https://github.com/rackt/react-router-redux/compare/1.0.2...2.0.2
// context: https://github.com/rackt/react-router-redux/pull/141#issuecomment-167587581
function listenToRouter(routerMiddleware, store) {
  routerMiddleware.listenForReplays(store);
}

function render() {
  if (__DEVTOOLS__ && !window.devToolsExtension) {
    var Tools = __DEVTOOLS_IS_VISIBLE__ ? DevTools : InvisibleDevTools;
    return _react2.default.createElement(Tools, null);
  }
}