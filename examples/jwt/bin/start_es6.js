#!/usr/bin/env node
import path from 'path';
import universal from 'universal-redux';
import universalConfig from '../config/universal-redux.config.js';
import authConfig from '../config/express-jwt-proxy.config.js';
import JwtProxy from 'express-jwt-proxy';

const app = universal.app();

JwtProxy(app, authConfig);

universal.setup(universalConfig);

app.listen(universalConfig.server.port, (err) => {
  if (err) {
    console.error(err);
  }
  console.info('==> 💻  Open http://localhost:%s in a browser to view the app.', universalConfig.server.port);
});

