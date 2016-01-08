import path from 'path';
import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';

import renderer from './server/renderer';
import configure from './configure';

function setupTools(config, projectToolsConfig) {
  const toolsConfig = projectToolsConfig || require('../config/webpack-isomorphic-tools-config');

  // bury it here rather than pollute the project directory
  toolsConfig.webpack_assets_file_path = 'node_modules/universal-redux/webpack-assets.json';

  const rootDir = config.webpack.config.context;
  const tools = new WebpackIsomorphicTools(toolsConfig);
  tools
    .development(__DEVELOPMENT__)
    .server(rootDir);

  return tools;
}

function setupAssets(server, config) {
  if (config.server.favicon) {
    server.use(favicon(path.resolve(config.server.favicon)));
  }
  const maxAge = config.server.maxAge || 0;
  server.use(Express.static(path.resolve(config.server.staticPath), { maxage: maxAge }));
}

export default class UniversalServer {

  static app(userSuppliedApp) {
    const server = userSuppliedApp || new Express();
    server.use(compression());

    return server;
  }

  static setup(server, projectConfig, projectToolsConfig) {
    const config = configure(projectConfig);
    const tools = setupTools(config, projectToolsConfig);

    setupAssets(server, config);
    server.use(renderer(config, tools));
    return config;
  }

  static start(server, projectConfig, projectToolsConfig) {
    const config = UniversalServer.setup(server, projectConfig, projectToolsConfig);
    server.listen(config.server.port, (err) => {
      if (err) {
        console.error(err);
      }
      console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.server.host, config.server.port);
    });
  }
}
