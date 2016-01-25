#!/usr/bin/env node
const PrettyError = require('pretty-error');
const server = require('../lib/server.js').default;
const userConfig = require('./user-config');

// since typically the dev server is logging this out too
userConfig.verbose = false;

const config = require('../lib/configure').default(require('./merge-configs')(userConfig));
const pretty = new PrettyError();

server(config)
  .then(() => {
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.server.host, config.server.port);
  })
  .catch((err) => {
    console.error(pretty.render(err));
  });
