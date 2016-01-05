const path = require('path');

try {
  const config = require(path.resolve('config/universal-redux.config.js'));
} catch (err) {
  console.error('No configuration file provided, using defaults.');
  return {};
}

module.exports = config;
