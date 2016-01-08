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

export default (server, projectConfig, projectToolsConfig) => {
  const config = configure(projectConfig);
  const tools = setupTools(config, projectToolsConfig);

  server.use(renderer(config, tools));

  server.listen(config.server.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.server.host, config.server.port);
  });
};
