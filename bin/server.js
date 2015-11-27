#!/usr/bin/env node
require('../server.babel'); // babel registration (runtime transpilation for node)
var path = require('path');

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

if (__DEVELOPMENT__) {
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
    return;
  }
}

process.env.CONFIG_PATH = process.env.CONFIG_PATH || 'src/config.js';

var config = require(path.resolve(process.env.CONFIG_PATH));

if(config.webpack.context) {
  var rootDir = path.resolve(config.webpack.context);
} else {
  var rootDir = path.resolve(__dirname, '..');
}

process.env.ASSETS_ROOT = rootDir + '/static';

var toolsConfig = require('../config/webpack-isomorphic-tools-config');
toolsConfig.webpack_assets_file_path = rootDir + '/webpack-assets.json',

// console.log('isomorphic tools root dir', rootDir)

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(toolsConfig)
  .development(__DEVELOPMENT__)
  .server(rootDir, function() {
    require('../lib/server');
  });
