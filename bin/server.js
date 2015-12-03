#!/usr/bin/env node
require('../server.babel'); // babel registration (runtime transpilation for node)
var path = require('path');
var renderer = require('../lib/server');
var config = require(path.resolve('config/redux-universal-renderer.config.js'));

// TODO: why does this script execute twice, once before requires are resolved??
if(renderer.app) {

  // method 1
  renderer.setup(config);
  renderer.start();

  // method 2
  // renderer.setup(config);
  // renderer.start();

  // method 3
  // renderer.configure(config);
  // renderer.setup();
  // renderer.start();
} else {
  console.log('Renderer not found.');
}
