'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _configure = require('./configure');

var _configure2 = _interopRequireDefault(_configure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (server, projectConfig) {
  var config = (0, _configure2.default)(projectConfig);

  server.listen(config.server.port, function (err) {
    if (err) {
      console.error(err);
    }
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.server.host, config.server.port);
  });
};