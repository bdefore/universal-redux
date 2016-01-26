import path from 'path';
import { match } from 'react-router';
import PrettyError from 'pretty-error';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';

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
  const rootComponent = require(config.rootComponent ? path.resolve(config.rootComponent) : '../helpers/rootComponent');
  const pretty = new PrettyError();


  const dynamicMiddleware = (originalUrl, headers, send, redirect) => {
    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      tools.refresh();
    }

    const middleware = config.redux.middleware ? require(path.resolve(config.redux.middleware)).default : [];
    const history = createMemoryHistory();
    const store = createStore(middleware, history);

    if (__DISABLE_SSR__) {
      const content = html(config, tools.assets(), store, headers);
      send(200, content);
    } else {
      match({ history, routes: getRoutes(store), location: originalUrl }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
          console.error('ROUTER ERROR:', pretty.render(error));
          send(500);
        } else if (renderProps) {
          rootComponent.createForServer(store, renderProps)
            .then(({ root }) => {
              const content = html(config, tools.assets(), store, headers, root);
              send(200, content);
            })
            .catch((err) => {
              send(500, err);
            });
        } else {
          send(400, 'Not found');
        }
      });
    }
  };

  function *koaMiddleware() {
    dynamicMiddleware(this.request.originalUrl,
      this.request.headers,
      (status, body) => {
        this.status = status;
        this.body = body;
      },
      (url) => this.response.redirect(url));
  }

  switch (config.server.rendererWebFramework) {
    case 'koa': {
      return koaMiddleware;
    }
    default:
    case 'express': {
      return (req, res) => {
        dynamicMiddleware(req.originalUrl,
          req._headers,
          (status, body) => res.status(status).send(body),
          (url) => res.redirect(url));
      };
    }
  }
};
