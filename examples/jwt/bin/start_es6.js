#!/usr/bin/env node
import { express, renderer, start } from 'universal-redux';
import universalConfig from '../config/universal-redux.config.js';
import authConfig from '../config/express-jwt-proxy.config.js';
import jwtProxy from 'express-jwt-proxy';

const app = express(universalConfig);
app.use(renderer(universalConfig));

jwtProxy(app, authConfig);

start(app, universalConfig);
