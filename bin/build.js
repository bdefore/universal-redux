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
console.log('\nBuilding...');
webpack(webpackConfig, function(err, stats) {
  if(err) {
    console.log('Webpack build had fatal error:', err);
    return;
  }

  var options = {
    hash: true,
    version: true,
    timings: true,
    assets: true,
    chunks: false,
    colors: true
  }

  console.log('Webpack compile was successful.');

  var jsonStats = stats.toJson();
  if(jsonStats.errors.length > 0) {
    console.log('Webpack had errors.');
    options.errors = true;
  }
  if(jsonStats.warnings.length > 0) {
    console.log('Webpack had warnings.');
    options.warnings = true;
  }

  console.log(stats.toString(options));

});
