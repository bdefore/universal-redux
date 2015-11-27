#!/usr/bin/env node
if (process.env.NODE_ENV !== 'production') {
  if (!require('piping')({
    hook: true,
    ignore: /(\/\.|~$|\.json$)/i
  })) {
    return;
  }
}

const path = require('path');
const config = require(path.resolve(process.env.CONFIG_PATH || 'src/config.js'));

if (config.apiPort) {
  require('../server.babel'); // babel registration (runtime transpilation for node)
  require('../lib/api/api');
} else {
  console.error('==>     No port has been specified to the API. Not starting it.');
}

