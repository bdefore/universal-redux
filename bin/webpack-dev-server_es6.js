#!/usr/bin/env node
const Express = require('express');
const webpack = require('webpack');
const userConfig = require('./user-config');

const config = require('./merge-configs')(userConfig);

const webpackConfig = config.webpack.config;
const compiler = webpack(webpackConfig);

const host = config.server.host || 'localhost';
const port = parseInt(config.server.port, 10) + 1 || 3001;
const serverOptions = {
  contentBase: 'http://' + host + ':' + port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true }
};

const app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
