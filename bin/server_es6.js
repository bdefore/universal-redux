#!/usr/bin/env node
const path = require('path');
const renderer = require('../lib/server').default;
const userConfig = require('./user-config');

// since typically the dev server is logging this out too
userConfig.verbose = false;

const config = require('./merge-configs')(userConfig);

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
