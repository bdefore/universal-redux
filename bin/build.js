#!/usr/bin/env node
var webpack = require('webpack');
var webpackConfig = require('./merge-configs');

console.log('\nBuilding webpack bundle...');
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
