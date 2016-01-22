const path = require('path');

const userConfigPath = path.join(process.cwd(), './config/universal-redux.config.js');

function getConfig() {
  try {
    const config = require(path.resolve(userConfigPath));
    console.log(`Loaded project level config from ${userConfigPath}`);
    return config;
  } catch (err) {
    console.error('No configuration file provided, using defaults.', err);
    return {};
  }
}

module.exports = getConfig();
