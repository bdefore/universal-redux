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
var isProduction = process.env.NODE_ENV === 'production';

// gather webpack config
var userConfig = require(path.resolve(process.env.CONFIG_PATH || 'src/config.js'));
var baseConfig = isProduction ? baseProdConfig : baseDevConfig;

combinedWebpackConfig = mergeWebpack(baseConfig, userConfig.webpack);

// gather tools config
var combinedToolsConfig = baseToolsConfig;
if(userConfig.toolsConfigPath) {
  var userToolsConfig = require(path.resolve(userConfig.toolsConfigPath));
  combinedToolsConfig = _.merge(baseToolsConfig, userToolsConfig);
}

// add tools settings to combined weback config
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var toolsPlugin = new WebpackIsomorphicToolsPlugin(combinedToolsConfig);

combinedWebpackConfig.module.loaders.push({ test: toolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' });
combinedWebpackConfig.plugins.push(isProduction ? toolsPlugin : toolsPlugin.development());

// add settings that are used by server via process.env
var definitions = {
  __DEVTOOLS__: !isProduction,
  __DEVELOPMENT__: !isProduction,
  'process.env': {
    SOURCE_ROOT: JSON.stringify(combinedWebpackConfig.resolve.root),
  }
};
_.each(userConfig.env, function(value, key) { definitions[key] = value; });
combinedWebpackConfig.plugins.push(new webpack.DefinePlugin(definitions));

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
