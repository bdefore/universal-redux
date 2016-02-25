'use strict';

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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _serializeJavascript = require('serialize-javascript');

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

var _reactDocumentMeta = require('react-document-meta');

var _reactDocumentMeta2 = _interopRequireDefault(_reactDocumentMeta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */

var Html = function (_Component) {
  (0, _inherits3.default)(Html, _Component);

  function Html() {
    (0, _classCallCheck3.default)(this, Html);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Html).apply(this, arguments));
  }

  (0, _createClass3.default)(Html, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var assets = _props.assets;
      var component = _props.component;
      var store = _props.store;

      var content = component ? _server2.default.renderToString(component) : '';

      return _react2.default.createElement(
        'html',
        { lang: 'en-us' },
        _react2.default.createElement(
          'head',
          null,
          _reactDocumentMeta2.default.renderAsReact(),
          _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
          (0, _keys2.default)(assets.styles).map(function (style, key) {
            return _react2.default.createElement('link', { href: assets.styles[style], key: key, media: 'screen, projection',
              rel: 'stylesheet', type: 'text/css', charSet: 'UTF-8' });
          })
        ),
        _react2.default.createElement(
          'body',
          null,
          _react2.default.createElement('div', { id: 'content', dangerouslySetInnerHTML: { __html: content } }),
          _react2.default.createElement('script', { dangerouslySetInnerHTML: { __html: 'window.__data=' + (0, _serializeJavascript2.default)(store.getState()) + ';' }, charSet: 'UTF-8' }),
          (0, _keys2.default)(assets.javascript).map(function (jsAsset, key) {
            return _react2.default.createElement('script', { src: assets.javascript[jsAsset], key: key, charSet: 'UTF-8' });
          })
        )
      );
    }
  }]);
  return Html;
}(_react.Component);

Html.propTypes = {
  assets: _react.PropTypes.object,
  component: _react.PropTypes.node,
  store: _react.PropTypes.object
};
exports.default = Html;