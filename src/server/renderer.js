import path from 'path';
import React from 'react';
import { RoutingContext, match } from 'react-router';
import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';

import createStore from '../shared/create';
import configure from '../configure';
import html from './html';
import getTools from './tools';

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

export default (projectConfig, projectToolsConfig) => {
  const tools = getTools(projectConfig, projectToolsConfig);
  const config = configure(projectConfig);
  const getRoutes = require(path.resolve(config.routes)).default;
  const pretty = new PrettyError();

  return (req, res) => {
    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      tools.refresh();
    }

    const middleware = config.redux.middleware ? require(path.resolve(config.redux.middleware)).default : [];
    console.log('middleware on serverside', middleware);
    const store = createStore(middleware);

    if (__DISABLE_SSR__) {
      const content = html(config.htmlShell, tools.assets(), store, res._headers);
      res.status(200).send(content);
    } else {
      match({ routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
          console.error('ROUTER ERROR:', pretty.render(error));
          res.status(500);
        } else if (renderProps) {
          const component = (
            <Provider store={store} key="provider">
              <RoutingContext />
            </Provider>
          );

          const content = html(config.htmlShell, tools.assets(), store, res._headers, component);
          res.status(200).send(content);
        } else {
          res.status(404).send('Not found');
        }
      });
    }
  };
};
