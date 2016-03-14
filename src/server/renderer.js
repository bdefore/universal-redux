import path from 'path';
import { match } from './providers/react-router';
import PrettyError from 'pretty-error';

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
  const rootComponentPath = config.rootServerComponent || config.rootComponent || __dirname + '/root';
  const rootServerComponent = require(path.resolve(rootComponentPath)).default;
  const getRoutes = require(path.resolve(config.routes)).default;
  const pretty = new PrettyError();

  const dynamicMiddleware = (originalUrl, headers, send, redirect) => {
    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      tools.refresh();
    }

    const middleware = config.redux.middleware ? require(path.resolve(config.redux.middleware)).default : [];
    const store = createStore(middleware);
    const routes = getRoutes(store);

    if (__DISABLE_SSR__) {
      const content = html(config, tools.assets(), store, headers);
      return new Promise(resolve => send(200, content, resolve)).then(() => {
      });
    }
    return new Promise((resolve) => {
      match(routes, originalUrl, store, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          redirect(redirectLocation.pathname + redirectLocation.search, resolve);
        } else if (error) {
          console.error('ROUTER ERROR:', pretty.render(error));
          send(500, resolve);
        } else if (renderProps) {
          rootServerComponent(store, renderProps, config.providers)
            .then((root) => {
              const content = html(config, tools.assets(), store, headers, root);
              send(200, content, resolve);
            })
            .catch((err) => {
              console.log('ERROR GENERATING ROOT COMPONENT', err, err.stack);
              send(500, err, resolve);
            });
        } else {
          send(404, 'Not found', resolve);
        }
      });
    }).then(() => {
    });
  };

  function *koaMiddleware() {
    yield dynamicMiddleware(this.request.originalUrl,
      this.request.headers,
      (status, body, resolve) => {
        this.status = status;
        this.body = body;
        resolve();
      },
      (url, resolve) => {
        this.response.redirect(url);
        resolve();
      });
  }

  switch (config.server.webFramework) {
    case 'koa': {
      return koaMiddleware;
    }
    default:
    case 'express': {
      return (req, res) => {
        dynamicMiddleware(req.originalUrl,
          res._headers,
          (status, body) => res.status(status).send(body),
          (url) => res.redirect(url));
      };
    }
  }
};
