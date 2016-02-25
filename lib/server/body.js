'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _serializeJavascript = require('serialize-javascript');

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Body = (_temp = _class = function (_Component) {
  (0, _inherits3.default)(Body, _Component);

  function Body() {
    (0, _classCallCheck3.default)(this, Body);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Body).apply(this, arguments));
  }

  (0, _createClass3.default)(Body, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var assets = _props.assets;
      var component = _props.component;
      var store = _props.store;

      var content = component ? _server2.default.renderToString(component) : '';

      return _react2.default.createElement(
        'body',
        null,
        _react2.default.createElement('div', { id: 'content', dangerouslySetInnerHTML: { __html: content } }),
        _react2.default.createElement('script', { dangerouslySetInnerHTML: { __html: 'window.__data=' + (0, _serializeJavascript2.default)(store.getState()) + ';' }, charSet: 'UTF-8' }),
        (0, _keys2.default)(assets.javascript).map(function (jsAsset, key) {
          return _react2.default.createElement('script', { src: assets.javascript[jsAsset], key: key, charSet: 'UTF-8' });
        })
      );
    }
  }]);
  return Body;
}(_react.Component), _class.propTypes = {
  additions: _react.PropTypes.string,
  assets: _react.PropTypes.object,
  component: _react.PropTypes.node,
  headers: _react.PropTypes.object,
  store: _react.PropTypes.object
}, _temp);
exports.default = Body;