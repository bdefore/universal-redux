'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _configure = require('./configure');

var _configure2 = _interopRequireDefault(_configure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (projectConfig) {
  var config = (0, _configure2.default)(projectConfig);
  var server = new _express2.default();
  server.use((0, _compression2.default)());

  if (config.server.favicon) {
    server.use((0, _serveFavicon2.default)(_path2.default.resolve(config.server.favicon)));
  }
  var maxAge = config.server.maxAge || 0;
  server.use(_express2.default.static(_path2.default.resolve(config.server.staticPath), { maxage: maxAge }));

  return server;
};