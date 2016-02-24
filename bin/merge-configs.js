#!/usr/bin/env node
const path = require('path');
const util = require('util');
const lodash = require('lodash');
const webpack = require('webpack');
const mergeWebpack = require('webpack-config-merger');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const WebpackErrorNotificationPlugin = require('webpack-error-notification');

const mergeBabel = require('./merge-babel-config');
const baseConfig = require('../config/universal-redux.config.js');
const webpackConfigs = require('../config/webpack.config.js');
const baseToolsConfig = require('../config/webpack-isomorphic-tools.config.js');

const isProduction = process.env.NODE_ENV === 'production';

function inspect(obj) {
  const utilOptions = {
    depth: 12,
    colors: true
  };

  console.log(util.inspect(obj, utilOptions));
}

module.exports = (userConfig) => {
  const projectRoot = process.cwd();
  const sourceRoot = `${projectRoot}/src`;

  // merge with base config
  const universalReduxConfig = lodash.merge(baseConfig, userConfig);

  // merge with base webpack config
  const webpackSubset = isProduction ? webpackConfigs.production : webpackConfigs.development;
  const baseWebpackConfig = mergeWebpack(webpackConfigs.common, webpackSubset);
  const combinedWebpackConfig = mergeWebpack(baseWebpackConfig, universalReduxConfig.webpack.config);
  combinedWebpackConfig.context = projectRoot;
  combinedWebpackConfig.resolve.root = sourceRoot;

  // derive webpack output destination from staticPath
  combinedWebpackConfig.output.path = universalReduxConfig.server.staticPath + '/dist';

  // add babel for js transpiling
  const babelConfig = mergeBabel(universalReduxConfig.babelConfig, universalReduxConfig.verbose);
  combinedWebpackConfig.module.loaders.unshift({ test: /\.jsx?$/, exclude: /node_modules/, loaders: babelConfig });

  // gather tools config
  const userToolsConfig = require(path.resolve(universalReduxConfig.toolsConfigPath));
  const combinedToolsConfig = lodash.merge(baseToolsConfig, userToolsConfig);

  // bury it here rather than pollute the project directory
  combinedToolsConfig.webpack_assets_file_path = 'node_modules/universal-redux/webpack-assets.json';

  // add tools settings to combined weback config
  const toolsPlugin = new WebpackIsomorphicToolsPlugin(combinedToolsConfig);

  combinedWebpackConfig.module.loaders.push({ test: toolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' });
  combinedWebpackConfig.plugins.push(isProduction ? toolsPlugin : toolsPlugin.development());

  // turn on linting per webpack build, unless directed not to
  if (universalReduxConfig.lint.enabled !== false && !isProduction) {
    combinedWebpackConfig.module.loaders[0].loaders.push('eslint-loader');
    const lintConfigPath = universalReduxConfig.lint.config || path.resolve(__dirname, '../.eslintrc');
    combinedWebpackConfig.eslint = {
      configFile: lintConfigPath
    };
  }

  // turn on desktop notifications if user elects to
  if (universalReduxConfig.notifications === true && !isProduction) {
    combinedWebpackConfig.plugins.push(new WebpackErrorNotificationPlugin());
  }

  // add routes, reducer, asyncHelpers and rootClientComponent aliases so that client has access to them
  combinedWebpackConfig.resolve.alias = combinedWebpackConfig.resolve.alias || {};
  combinedWebpackConfig.resolve.alias['universal-redux/routes'] = universalReduxConfig.routes;
  combinedWebpackConfig.resolve.alias['universal-redux/middleware'] = universalReduxConfig.redux.middleware || path.resolve(__dirname, '../lib/helpers/empty.js');
  const rootComponentPath = universalReduxConfig.rootClientComponent || universalReduxConfig.rootComponent || path.resolve(__dirname, '../lib/client/root.js');
  combinedWebpackConfig.resolve.alias['universal-redux/rootClientComponent'] = rootComponentPath;
  combinedWebpackConfig.resolve.alias['universal-redux/asyncHelpers'] = universalReduxConfig.reduxAsyncConnect.helpers || path.resolve(__dirname, '../lib/helpers/emptyFunction.js');

  // add project level vendor libs
  if (universalReduxConfig.webpack.vendorLibraries && isProduction) {
    lodash.each(universalReduxConfig.webpack.vendorLibraries, (lib) => {
      combinedWebpackConfig.entry.vendor.push(lib);
    });
  }

  // add default settings that are used by server via process.env
  const definitions = {
    __DEVTOOLS__: !isProduction,
    __DEVELOPMENT__: !isProduction,
    __LOGGER__: false,
    __PROVIDERS__: JSON.stringify(universalReduxConfig.providers)
  };

  // override with user settings
  lodash.each(universalReduxConfig.globals, (value, key) => { definitions[key] = JSON.stringify(value); });
  combinedWebpackConfig.plugins.push(new webpack.DefinePlugin(definitions));

  // output configuration files if user wants verbosity
  if (universalReduxConfig.verbose) {
    console.log('\nWebpack config:');
    inspect(combinedWebpackConfig);
    console.log('\nIsomorphic tools config:');
    inspect(combinedToolsConfig);
  }

  universalReduxConfig.webpack.config = combinedWebpackConfig;

  return universalReduxConfig;
};
