#!/usr/bin/env node
require('../server.babel'); // babel registration (runtime transpilation for node)

var path = require('path');
var Express = require('express');
var webpack = require('webpack');
var webpackConfig = require('./merge-configs');
var userConfig = require(path.resolve('config/universal-redux.config.js'));

var compiler = webpack(webpackConfig);

var host = userConfig.server.host || 'localhost';
var port = parseInt(userConfig.server.port) + 1 || 3001;
var serverOptions = {
  contentBase: 'http://' + host + ':' + port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
