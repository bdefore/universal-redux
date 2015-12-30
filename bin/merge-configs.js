#!/usr/bin/env node
const path = require('path');
const util = require('util');

const lodash = require('lodash');
const webpack = require('webpack');
const mergeWebpack = require('webpack-config-merger');
const mergeBabel = require('./merge-babel-config');
const baseWebpackConfig = require('../config/webpack.config.js');
const baseDevConfig = mergeWebpack(baseWebpackConfig.common, baseWebpackConfig.development);
const baseProdConfig = mergeWebpack(baseWebpackConfig.common, baseWebpackConfig.production);
const baseToolsConfig = require('../config/webpack-isomorphic-tools-config');
const WebpackErrorNotificationPlugin = require('webpack-error-notification');

const isProduction = process.env.NODE_ENV === 'production';

// gather webpack config
const userConfigPath = 'config/universal-redux.config.js';
const userConfig = require(path.resolve(userConfigPath));

// merge with base config if directed to
const baseConfig = isProduction ? baseProdConfig : baseDevConfig;
const combinedWebpackConfig = userConfig.webpack.merge ? mergeWebpack(baseConfig, userConfig.webpack.config) : userConfig.webpack.config;

// add babel for js transpiling
const babelConfig = mergeBabel(userConfig.babelConfig, userConfig.verbose);
combinedWebpackConfig.module.loaders.unshift({ test: /\.jsx?$/, exclude: /node_modules/, loaders: babelConfig });

// gather tools config
const combinedToolsConfig = baseToolsConfig;
if (userConfig.toolsConfigPath) {
  const userToolsConfig = require(path.resolve(userConfig.toolsConfigPath));
  combinedToolsConfig = lodash.merge(baseToolsConfig, userToolsConfig);
}
combinedToolsConfig.webpack_assets_file_path = 'node_modules/universal-redux/webpack-assets.json';

// add tools settings to combined weback config
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const toolsPlugin = new WebpackIsomorphicToolsPlugin(combinedToolsConfig);

combinedWebpackConfig.module.loaders.push({ test: toolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' });
combinedWebpackConfig.plugins.push(isProduction ? toolsPlugin : toolsPlugin.development());

// turn on linting per webpack build, unless directed not to
if (userConfig.lint && userConfig.lint.enabled !== false && !isProduction) {
  combinedWebpackConfig.module.loaders[0].loaders.push('eslint-loader');
  const lintConfigPath = userConfig.lint.config || path.resolve(__dirname, '../.eslintrc');
  combinedWebpackConfig.eslint = {
    configFile: lintConfigPath
  };
}

// turn on desktop notifications if user elects to
if (userConfig.notifications === true && !isProduction) {
  combinedWebpackConfig.plugins.push(new WebpackErrorNotificationPlugin());
}

// add default settings that are used by server via process.env
const definitions = {
  __LOGGER__: false,
  __DEVTOOLS__: !isProduction,
  __DEVELOPMENT__: !isProduction,
  __REDUCER_INDEX__: userConfig.redux.reducers // only used for hot reloader in src/redux/create.js. may be able to remove?
};

// override with user settings
lodash.each(userConfig.globals, (value, key) => { definitions[key] = JSON.stringify(value); });
combinedWebpackConfig.plugins.push(new webpack.DefinePlugin(definitions));

// add routes and reducer aliases so that client has access to them
combinedWebpackConfig.resolve.alias = combinedWebpackConfig.resolve.alias || {};
combinedWebpackConfig.resolve.alias.routes = userConfig.routes;
combinedWebpackConfig.resolve.alias.reducers = userConfig.redux.reducers;
combinedWebpackConfig.resolve.alias.config = combinedWebpackConfig.context + '/' + userConfigPath;
if (userConfig.redux.middleware) {
  combinedWebpackConfig.resolve.alias.middleware = userConfig.redux.middleware;
} else {
  combinedWebpackConfig.resolve.alias.middleware = path.resolve(__dirname, '../src/redux/middleware/index.js');
}

// add project level vendor libs
if (userConfig.webpack && userConfig.webpack.vendorLibraries && isProduction) {
  lodash.each(userConfig.webpack.vendorLibraries, (lib) => {
    combinedWebpackConfig.entry.vendor.push(lib);
  });
}

// output configuration files if user wants verbosity
if (userConfig.verbose) {
  const utilOptions = {
    depth: 6,
    colors: true
  };

  console.log('Webpack config:');
  console.log(util.inspect(combinedWebpackConfig, utilOptions));
  console.log('\nIsomorphic tools config:');
  console.log(util.inspect(combinedToolsConfig, utilOptions));
}

module.exports = combinedWebpackConfig;
