const path = require('path');

const userConfigPath = path.join(process.cwd(), './config/universal-redux.config.js');
console.log('getting config', userConfigPath);

function getConfig() {
  try {
    console.log('Trying to load project config from ', userConfigPath);
    const config = require(path.resolve(userConfigPath));
    console.log('Loaded project level config', config);
    return config;
  } catch (err) {
    console.error('No configuration file provided, using defaults.', err);
    return {};
  }
}

module.exports = getConfig();
