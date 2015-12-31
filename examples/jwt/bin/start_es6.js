#!/usr/bin/env node
import path from 'path';
import universal from 'universal-redux';
import universalConfig from '../config/universal-redux.config.js';
import authConfig from '../config/express-jwt-proxy.config.js';
import JwtProxy from 'express-jwt-proxy';

const app = universal.app();

JwtProxy(app, authConfig);

universal.setup(universalConfig);
universal.start();
