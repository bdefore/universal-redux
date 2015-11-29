#!/usr/bin/env node
var path = require('path');
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
  console.log('userToolsConfig', userToolsConfig)
  console.log('baseToolsConfig', baseToolsConfig)
  combinedToolsConfig = merge(baseToolsConfig, userToolsConfig);
  console.log('combinedToolsConfig', combinedToolsConfig);
}

// add tools settings to combined weback config
// console.log(__dirname, '..', '/node_modules/webpack-isomorphic-tools/plugin.js');
// var pluginPath = path.resolve(__dirname, '..', '/node_modules/webpack-isomorphic-tools/plugin.js');
// console.log(pluginPath);
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var toolsPlugin = new WebpackIsomorphicToolsPlugin(combinedToolsConfig);

combinedConfig.module.loaders.push({ test: toolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' });
combinedConfig.plugins.push(process.env.NODE_ENV === 'production' ? toolsPlugin : toolsPlugin.development());

// add settings that are used by server via process.env
combinedConfig.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    SOURCE_ROOT: JSON.stringify(combinedConfig.resolve.root),
    API_PREFIX: JSON.stringify(combinedConfig.apiPrefix)
  }
}));

return combinedConfig
