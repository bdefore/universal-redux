'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _mergeConfigs = require('../bin/merge-configs');

var _mergeConfigs2 = _interopRequireDefault(_mergeConfigs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateConfig(config) {
  var errors = [];
  if (!config) {
    errors.push('==>     ERROR: No configuration supplied.');
  }
  if (config.server) {
    if (!config.server.host) {
      errors.push('==>     ERROR: No host parameter supplied.');
    }
    if (!config.server.port) {
      errors.push('==>     ERROR: No port parameter supplied.');
    }
  }
  if (!config.routes) {
    errors.push('==>     ERROR: Must supply routes.');
  }
  // TODO: check for more
  return errors;
}

exports.default = function (projectConfig) {
  // since typically the dev server is logging this out too
  projectConfig.verbose = false;

  var config = (0, _mergeConfigs2.default)(projectConfig);

  // add user defined globals for serverside access
  (0, _lodash.each)(config.globals, function (value, key) {
    global[key] = value;
  });

  var errors = validateConfig(config);

  if (errors.length > 0) {
    (0, _lodash.each)(errors, function (error) {
      console.error(error);
    });
    throw new Error('Configuration errors for universal-redux. Stopping.');
  } else {
    console.log('universal-redux configuration is valid.');
  }

  return config;
};