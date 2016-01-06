// node modules dependencies
import path from 'path';
import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import favicon from 'serve-favicon';
import compression from 'compression';
import PrettyError from 'pretty-error';
import { each } from 'lodash';
import { RoutingContext, match } from 'react-router';
import { Provider } from 'react-redux';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';

// dependencies of serverside render
import createStore from './redux/create';
import Html from './containers/HtmlShell/HtmlShell';
import getStatusFromRoutes from './helpers/getStatusFromRoutes';
import mergeConfigs from '../bin/merge-configs';

let app;
let hasSetup = false;
let tools;
let config;
let toolsConfig = require('../config/webpack-isomorphic-tools-config');

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

function setupTools() {
  toolsConfig.webpack_assets_file_path = 'node_modules/universal-redux/webpack-assets.json';

  const rootDir = config.webpack.config.context;

  tools = new WebpackIsomorphicTools(toolsConfig);
  tools
    .development(__DEVELOPMENT__)
    .server(rootDir);
}

function setupAssets() {
  if (config.server.favicon) {
    app.use(favicon(path.resolve(config.server.favicon)));
  }
  const maxAge = config.server.maxAge || 0;
  app.use(Express.static(path.resolve(config.server.staticPath), { maxage: maxAge }));
}

function setupRenderer() {

  const getRoutes = require(path.resolve(config.routes)).default;
  const reducers = require(path.resolve(config.redux.reducers)).default;
  const pretty = new PrettyError();

  let CustomHtml;
  if (config.htmlShell) {
    CustomHtml = require(path.resolve(config.htmlShell)).default;
  } else {
    CustomHtml = Html;
  }

  app.use((req, res) => {

    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      tools.refresh();
    }

    // assemble custom middleware, pass req, res
    const middleware = [];
    if (config.redux.middleware) {
      const customMiddleware = require(path.resolve(config.redux.middleware)).default;
      each(customMiddleware, (customMiddlewareToAdd) => {
        if (typeof customMiddlewareToAdd === 'function') {
          middleware.push(customMiddlewareToAdd(req, res));
        }
      });
    }

    const store = createStore(middleware, reducers);

    function hydrateOnClient() {
      res.send('<!doctype html>\n' + ReactDOM.renderToString(<CustomHtml assets={tools.assets()} store={store} headers={res._headers} />));
    }

    if (__DISABLE_SSR__) {
      hydrateOnClient();
      return;
    }

    match({ routes: getRoutes(),
            location: req.originalUrl }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (error) {
        console.error('ROUTER ERROR:', pretty.render(error));
        res.status(500);
        hydrateOnClient();
      } else if (renderProps) {
        const component = (
          <Provider store={store} key="provider">
            <RoutingContext {...renderProps} />
          </Provider>
        );

        const status = getStatusFromRoutes(renderProps.routes);
        if (status) {
          res.status(status);
        }
        res.send('<!doctype html>\n' + ReactDOM.renderToString(<CustomHtml assets={tools.assets()} component={component} store={store} headers={res._headers} />));
      } else {
        res.status(404).send('Not found');
      }
    });
  });
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

export default class Renderer {

  static configure(providedConfig, userToolsConfig) {
    if (!hasSetup) {
      Renderer.app();
    }

    // since typically the dev server is logging this out too
    providedConfig.verbose = false;

    config = mergeConfigs(providedConfig);

    // add user defined globals for serverside access
    each(config.globals, (value, key) => { global[key] = JSON.stringify(value); });
    global.__REDUCER_INDEX__ = config.redux.reducers;

    if (userToolsConfig) {
      toolsConfig = userToolsConfig;
    }
    const errors = validateConfig();

    if (errors.length > 0) {
      each(errors, (error) => { console.error(error); });
      throw new Error('Configuration errors for universal-redux. Stopping.');
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

  static setup(providedConfig, userToolsConfig) {
    if (providedConfig) {
      const errors = Renderer.configure(providedConfig, userToolsConfig);
      if (errors.length > 0) {
        return;
      }
    }

    setupTools();
    setupAssets();
    setupRenderer();
  }

  static start() {
    if (!hasSetup) {
      Renderer.app();
    }

    app.listen(config.server.port, (err) => {
      if (err) {
        console.error(err);
      }
      console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.server.host, config.server.port);
    });
  }
}
