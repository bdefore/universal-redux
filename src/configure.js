import { each } from 'lodash';

function validateConfig(config) {
  const errors = [];
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

export default (config) => {
  // since typically the dev server is logging this out too
  config.verbose = false;

  // add user defined globals for serverside access
  each(config.globals, (value, key) => { global[key] = JSON.stringify(value); });

  const errors = validateConfig(config);

  if (errors.length > 0) {
    each(errors, (error) => { console.error(error); });
    throw new Error('Configuration errors for universal-redux. Stopping.');
  } else {
    console.log('universal-redux configuration is valid.');
  }

  return config;
};
