#!/usr/bin/env node
var path = require('path');
var webpack = require('webpack');
var merge = require('lodash.merge');
var mergeWebpack = require('webpack-config-merger');
var baseDevConfig = require('../config/dev.config');
var baseProdConfig = require('../config/prod.config');
var baseToolsConfig = require('../config/webpack-isomorphic-tools-config');

// gather webpack config
var userConfig = require(path.resolve(process.env.CONFIG_PATH || 'src/config.js'));
var baseConfig = process.env.NODE_ENV === 'production' ? baseProdConfig : baseDevConfig;

combinedConfig = mergeWebpack(baseConfig, userConfig.webpack);

// gather tools config
var combinedToolsConfig = baseToolsConfig;
if(userConfig.toolsConfigPath) {
  var userToolsConfig = require(path.resolve(userConfig.toolsConfigPath));
  combinedToolsConfig = merge(baseToolsConfig, userToolsConfig);
}

// add tools settings to combined weback config
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var toolsPlugin = new WebpackIsomorphicToolsPlugin(combinedToolsConfig);

combinedConfig.module.loaders.push({ test: toolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' });
combinedConfig.plugins.push(process.env.NODE_ENV === 'production' ? toolsPlugin : toolsPlugin.development());

// add settings that are used by server via process.env
combinedConfig.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    SOURCE_ROOT: JSON.stringify(combinedConfig.resolve.root),
  }
}));

module.exports = combinedConfig;
