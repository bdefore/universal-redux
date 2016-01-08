import path from 'path';
import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import { each } from 'lodash';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';

import renderer from './server/renderer';
import mergeConfigs from '../bin/merge-configs';

let app;
let hasSetup = false;
let config;
let toolsConfig = require('../config/webpack-isomorphic-tools-config');

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

function setupTools(rootDir) {
  const tools = new WebpackIsomorphicTools(toolsConfig);
  tools
    .development(__DEVELOPMENT__)
    .server(rootDir);

  return tools;
}

function setupAssets() {
  if (config.server.favicon) {
    app.use(favicon(path.resolve(config.server.favicon)));
  }
  const maxAge = config.server.maxAge || 0;
  app.use(Express.static(path.resolve(config.server.staticPath), { maxage: maxAge }));
}

function validateConfig() {
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
  if (!config.redux.reducers) {
    errors.push('==>     ERROR: Must supply redux configuration.');
  } else if (!config.redux.reducers) {
    errors.push('==>     ERROR: Must supply reducers.');
  }
  // TODO: check for more
  return errors;
}

export default class UniversalServer {

  static configure(projectConfig, projectToolsConfig) {
    if (!hasSetup) {
      UniversalServer.app();
    }

    // since typically the dev server is logging this out too
    projectConfig.verbose = false;

    config = mergeConfigs(projectConfig);

    // add user defined globals for serverside access
    each(config.globals, (value, key) => { global[key] = JSON.stringify(value); });
    global.__REDUCER_INDEX__ = config.redux.reducers;

    if (projectToolsConfig) {
      toolsConfig = projectToolsConfig;
    }
    toolsConfig.webpack_assets_file_path = 'node_modules/universal-redux/webpack-assets.json';

    const errors = validateConfig();

    if (errors.length > 0) {
      each(errors, (error) => { console.error(error); });
    } else {
      console.log('universal-redux configuration is valid.');
    }

    return errors;
  }

  static app(userSuppliedApp) {
    app = userSuppliedApp || new Express();
    app.use(compression());

    hasSetup = true;

    return app;
  }

  static setup(projectConfig, projectToolsConfig) {
    if (projectConfig) {
      const errors = UniversalServer.configure(projectConfig, projectToolsConfig);
      if (errors.length > 0) {
        throw new Error('Configuration errors for universal-redux. Stopping.');
      }
    }

    const tools = setupTools(config.webpack.config.context);
    setupAssets();
    app.use(renderer(config, tools));
  }

  static start() {
    if (!hasSetup) {
      UniversalServer.app();
    }

    app.listen(config.server.port, (err) => {
      if (err) {
        console.error(err);
      }
      console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.server.host, config.server.port);
    });
  }
}
