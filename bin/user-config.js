const path = require('path');

function getConfig() {
  try {
    const config = require(path.resolve('config/universal-redux.config.js'));
    return config;
  } catch (err) {
    console.error('No configuration file provided, using defaults.');
    return {};
  }
}

module.exports = getConfig();
