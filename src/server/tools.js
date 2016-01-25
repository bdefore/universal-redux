import WebpackIsomorphicTools from 'webpack-isomorphic-tools';

export default (config, projectToolsConfig) => {
  const toolsConfig = projectToolsConfig || require('../../config/webpack-isomorphic-tools.config.js');
  const rootDir = config.webpack.config.context;
  const tools = new WebpackIsomorphicTools(toolsConfig);
  tools
    .development(__DEVELOPMENT__)
    .server(rootDir);

  return tools;
};
