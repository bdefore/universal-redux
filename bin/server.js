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

var config = require(path.resolve(process.env.CONFIG_PATH || 'src/config.js'));

// hang source root on process.env, needed for serverside render require() statements to know where
// to resolve them from
process.env.SOURCE_ROOT = config.webpack.resolve.root;

var toolsConfig = require('../webpack/webpack-isomorphic-tools-config');

if(config.webpack.context) {
  console.log('found context');
  var rootDir = path.resolve(config.webpack.context);
} else {
  console.log('did not find context');
  var rootDir = path.resolve(__dirname, '..');
}

toolsConfig.webpack_assets_file_path = rootDir + '/webpack-assets.json',

console.log('isomorphic tools root dir', rootDir)

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(toolsConfig)
  .development(__DEVELOPMENT__)
  .server(rootDir, function() {
    require('../lib/server');
  });
