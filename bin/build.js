#!/usr/bin/env node
var webpack = require('webpack');
var path = require('path');
var merge = require('webpack-config-merger');

var config = require(path.resolve(process.env.CONFIG_PATH || 'src/config.js'));
var webpackConfig = require('../config/prod.config');

webpackConfig = merge(webpackConfig, config.webpack);

webpackConfig.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    SOURCE_ROOT: JSON.stringify(webpackConfig.resolve.root)
  }
}));

console.log('Webpack config:', webpackConfig);
webpack(webpackConfig, function(err, stats) {
  console.log('Webpack build completed. Error?', err);
});
