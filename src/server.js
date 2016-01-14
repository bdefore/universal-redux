import path from 'path';
import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';

import configure from './configure';

export default (projectConfig) => {
  const config = configure(projectConfig);
  const server = new Express();
  server.use(compression());

  if (config.server.favicon) {
    server.use(favicon(path.resolve(config.server.favicon)));
  }
  const maxAge = config.server.maxAge || 0;
  server.use(Express.static(path.resolve(config.server.staticPath), { maxage: maxAge }));

  return server;
};
