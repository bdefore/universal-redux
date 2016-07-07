const path = require('path');

const userConfigPath = path.join(process.cwd(), './config/universal-redux.config.js');

function getConfig() {
  try {
    const config = require(path.resolve(userConfigPath));
    if (config.verbose) {
      console.log(`Loaded project level config from ${userConfigPath}`);
    }
    return config;
  } catch (err) {
    console.warn('No configuration file found, using defaults.');
    return {};
  }
}

module.exports = getConfig();
