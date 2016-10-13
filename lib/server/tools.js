'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpackIsomorphicTools = require('webpack-isomorphic-tools');

var _webpackIsomorphicTools2 = _interopRequireDefault(_webpackIsomorphicTools);

var _configure = require('../configure');

var _configure2 = _interopRequireDefault(_configure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (projectConfig, projectToolsConfig) {
  var config = (0, _configure2.default)(projectConfig);
  var toolsConfig = projectToolsConfig || require('../../config/webpack-isomorphic-tools.config.js');
  var rootDir = config.webpack.config.context;
  var tools = new _webpackIsomorphicTools2.default(toolsConfig);
  tools.development(__DEVELOPMENT__).server(rootDir);

  return tools;
};