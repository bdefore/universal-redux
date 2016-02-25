'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _create = require('./shared/create');

var _create2 = _interopRequireDefault(_create);

var _devtools = require('./client/devtools');

var _middleware = require('universal-redux/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _rootClientComponent = require('universal-redux/rootClientComponent');

var _rootClientComponent2 = _interopRequireDefault(_rootClientComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// dependencies of external source. these resolve via webpack aliases
// as assigned in merge-configs.js

var dest = document.getElementById('content');

var store = (0, _create2.default)(_middleware2.default, window.__data);
var devComponent = (0, _devtools.render)();

// There is probably no need to be asynchronous here
(0, _rootClientComponent2.default)(store, __PROVIDERS__, devComponent).then(function (root) {
  _reactDom2.default.render(root, dest);

  if (process.env.NODE_ENV !== 'production') {
    window.React = _react2.default; // enable debugger
    if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
      console.warn('WARNING: Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
    }
  }
}).catch(function (err) {
  console.error(err, err.stack);
});