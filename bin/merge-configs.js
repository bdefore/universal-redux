#!/usr/bin/env node
var path = require('path');
var util = require('util');
var webpack = require('webpack');
var merge = require('lodash.merge');
var mergeWebpack = require('webpack-config-merger');
var baseDevConfig = require('../config/dev.config');
var baseProdConfig = require('../config/prod.config');
var baseToolsConfig = require('../config/webpack-isomorphic-tools-config');

// gather webpack config
var userConfig = require(path.resolve(process.env.CONFIG_PATH || 'src/config.js'));
var baseConfig = process.env.NODE_ENV === 'production' ? baseProdConfig : baseDevConfig;

combinedWebpackConfig = mergeWebpack(baseConfig, userConfig.webpack);

// gather tools config
var combinedToolsConfig = baseToolsConfig;
if(userConfig.toolsConfigPath) {
  var userToolsConfig = require(path.resolve(userConfig.toolsConfigPath));
  combinedToolsConfig = merge(baseToolsConfig, userToolsConfig);
}

// add tools settings to combined weback config
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var toolsPlugin = new WebpackIsomorphicToolsPlugin(combinedToolsConfig);

combinedWebpackConfig.module.loaders.push({ test: toolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' });
combinedWebpackConfig.plugins.push(process.env.NODE_ENV === 'production' ? toolsPlugin : toolsPlugin.development());

// add settings that are used by server via process.env
combinedWebpackConfig.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    SOURCE_ROOT: JSON.stringify(combinedWebpackConfig.resolve.root),
  }
}));

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
