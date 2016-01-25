import React from 'react';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';

import path from 'path';
import { match } from 'react-router';
import PrettyError from 'pretty-error';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';

import createStore from '../shared/create';
import html from './html';
import getTools from './tools';
import { hooks, execute } from '../hooks';

const pretty = new PrettyError();

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

function createRootComponent({ store, renderProps }) {
  const root = (
    <Provider store={store} key="provider">
      <div>
        <RouterContext {...renderProps} />
      </div>
    </Provider>
  );
  return { root };
}

function renderRootComponent({ config, assets, store, headers, root }) {
  return {
    status: 200,
    body: html(config, assets, store, headers, root)
  };
}

function renderer({ history, routes, store, assets, location, headers, config }) {
  return new Promise((resolve, reject) => {
    match({ history, routes, location }, (error, redirectLocation, renderProps) => {
      if (error) {
        reject(error);
      } else if (redirectLocation) {
        resolve({ redirect: redirectLocation.pathname + redirectLocation.search });
      } else if (!renderProps) {
        reject({ status: 400 });
      } else {
        execute(hooks.CREATE_ROOT_COMPONENT, { store, renderProps }, createRootComponent)
          .then(({ root }) => execute(hooks.RENDER_ROOT_COMPONENT, { config, assets, store, headers, root }, renderRootComponent))
          .then(resolve, reject);
      }
    });
  })
  .catch((err) => {
    const error = pretty.render(err);
    console.error(error);
    return {
      error: pretty.render(error),
      status: 500
    };
  });
}

export default (config) => {
  const tools = getTools(config);
  const getRoutes = require(path.resolve(config.routes)).default;

  const middleware = config.redux.middleware ? require(path.resolve(config.redux.middleware)).default : [];
  const history = createMemoryHistory();
  const store = createStore(middleware, history);

  return ({ location, headers }) => {
    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      tools.refresh();
    }
    const assets = tools.assets();
    const routes = getRoutes(store);
    return renderer({ history, routes, store, assets, location, headers, config });
  };
};
