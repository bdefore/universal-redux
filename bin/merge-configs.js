#!/usr/bin/env node
var _ = require('lodash');
var path = require('path');
var util = require('util');
var webpack = require('webpack');
var mergeWebpack = require('webpack-config-merger');
var baseWebpackConfig = require('../config/webpack.config.js');
var baseDevConfig = mergeWebpack(baseWebpackConfig.common, baseWebpackConfig.development);
var baseProdConfig = mergeWebpack(baseWebpackConfig.common, baseWebpackConfig.production);
var baseToolsConfig = require('../config/webpack-isomorphic-tools-config');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');

var isProduction = process.env.NODE_ENV === 'production';

// gather webpack config
var userConfigPath = 'config/universal-redux.config.js';
var userConfig = require(path.resolve(userConfigPath));

// merge with base config if directed to
if(userConfig.webpack.merge) {
  var baseConfig = isProduction ? baseProdConfig : baseDevConfig;
  combinedWebpackConfig = mergeWebpack(baseConfig, userConfig.webpack.config);
} else {
  combinedWebpackConfig = userConfig.webpack.config;
}

// gather tools config
var combinedToolsConfig = baseToolsConfig;
if(userConfig.toolsConfigPath) {
  var userToolsConfig = require(path.resolve(userConfig.toolsConfigPath));
  combinedToolsConfig = _.merge(baseToolsConfig, userToolsConfig);
}
combinedToolsConfig.webpack_assets_file_path = 'node_modules/universal-redux/webpack-assets.json';

// add tools settings to combined weback config
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var toolsPlugin = new WebpackIsomorphicToolsPlugin(combinedToolsConfig);

combinedWebpackConfig.module.loaders.push({ test: toolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' });
combinedWebpackConfig.plugins.push(isProduction ? toolsPlugin : toolsPlugin.development());

// turn on linting per webpack build, unless directed not to
if(userConfig.lint !== false && !isProduction) {
  combinedWebpackConfig.module.loaders[0].loaders.push('eslint-loader');
  combinedWebpackConfig.eslint = {
    configFile: path.resolve(__dirname, '../.eslintrc')
  }
} 

// turn on desktop notifications if user elects to
if(userConfig.notifications === true && !isProduction) {
  combinedWebpackConfig.plugins.push(new WebpackErrorNotificationPlugin());
}

// add default settings that are used by server via process.env
var apiPrefix = userConfig.apiPrefix ? userConfig.apiPrefix : 'api';
var definitions = {
  __LOGGER__: false,
  __DEVTOOLS__: !isProduction,
  __DEVELOPMENT__: !isProduction,
  __CONFIG__: JSON.stringify(userConfig)
};

// override with user settings
_.each(userConfig.globals, function(value, key) { definitions[key] = value; });
combinedWebpackConfig.plugins.push(new webpack.DefinePlugin(definitions));

// add routes and reducer aliases so that client has access to them
combinedWebpackConfig.resolve.alias = combinedWebpackConfig.resolve.alias || {};
combinedWebpackConfig.resolve.alias.routes = userConfig.routes;
combinedWebpackConfig.resolve.alias.reducers = userConfig.redux.reducers;
combinedWebpackConfig.resolve.alias.config = combinedWebpackConfig.context + '/' + userConfigPath;
if(userConfig.redux.middleware) {
  combinedWebpackConfig.resolve.alias.middleware = userConfig.redux.middleware;
} else {
  combinedWebpackConfig.resolve.alias.middleware = path.resolve(__dirname, '../lib/redux/middleware/index.js');
}

// output configuration files if user wants verbosity
if(userConfig.verbose) {
  var utilOptions = {
    depth: 6,
    colors: true
  };

  console.log('Webpack config:');
  console.log(util.inspect(combinedWebpackConfig, utilOptions));
  console.log('\nIsomorphic tools config:');
  console.log(util.inspect(combinedToolsConfig, utilOptions));
}

module.exports = combinedWebpackConfig;
