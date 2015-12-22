#!/usr/bin/env node
const path = require('path');
const renderer = require('../lib/server').default;
const config = require(path.resolve('config/universal-redux.config.js'));

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
