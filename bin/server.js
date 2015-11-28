#!/usr/bin/env node
require('../server.babel'); // babel registration (runtime transpilation for node)
var path = require('path');
var starter = require('../lib/server');

process.env.CONFIG_PATH = process.env.CONFIG_PATH || 'src/config.js';

var config = require(path.resolve(process.env.CONFIG_PATH));

// TODO: why does this script execute twice, once before requires are resolved??
if(starter.app) {
  starter.app(config);
}
