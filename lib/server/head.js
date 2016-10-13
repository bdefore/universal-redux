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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDocumentMeta = require('react-document-meta');

var _reactDocumentMeta2 = _interopRequireDefault(_reactDocumentMeta);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Head = (_temp = _class = function (_Component) {
  (0, _inherits3.default)(Head, _Component);

  function Head() {
    (0, _classCallCheck3.default)(this, Head);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Head).apply(this, arguments));
  }

  (0, _createClass3.default)(Head, [{
    key: 'renderAdditions',
    value: function renderAdditions() {
      var _props = this.props;
      var additions = _props.additions;
      var headers = _props.headers;
      var store = _props.store;

      if (additions) {
        var additionsNode = require(_path2.default.resolve(additions)).default;
        return additionsNode(store, headers);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var assets = this.props.assets;

      return _react2.default.createElement(
        'head',
        null,
        _reactDocumentMeta2.default.renderAsReact(),
        _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
        (0, _keys2.default)(assets.styles).map(function (style, key) {
          return _react2.default.createElement('link', { href: assets.styles[style], key: key, media: 'screen, projection',
            rel: 'stylesheet', type: 'text/css', charSet: 'UTF-8' });
        }),
        this.renderAdditions()
      );
    }
  }]);
  return Head;
}(_react.Component), _class.propTypes = {
  additions: _react.PropTypes.string,
  assets: _react.PropTypes.object,
  headers: _react.PropTypes.object,
  store: _react.PropTypes.object
}, _temp);
exports.default = Head;