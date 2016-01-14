#!/usr/bin/env node
const express = require('../lib/server.js').default;
const renderer = require('../lib/server/renderer').default;
const start = require('../lib/start').default;
const userConfig = require('./user-config');

// since typically the dev server is logging this out too
userConfig.verbose = false;

const config = require('./merge-configs')(userConfig);

const app = express(config);
app.use(renderer(config));
start(app, config);
