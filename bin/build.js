#!/usr/bin/env node
require('../server.babel'); // babel registration (runtime transpilation for node)

var webpack = require('webpack');
var webpackConfig = require('./merge-configs');
var fs = require('fs');
// var outputStatsPath = './webpack-stats.json';

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

  if(outputStatsPath) {
    fs.writeFile(outputStatsPath, JSON.stringify(stats.toJson()), function(err) {
      if(err) {
        return console.log(err);
      }

      console.log('Webpack output stats were saved to', outputStatsPath);
    });
  }
});
