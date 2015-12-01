#!/usr/bin/env node
var path = require('path');
var Express = require('express');
var webpack = require('webpack');
var webpackConfig = require('./merge-configs');
var userConfig = require(path.resolve(process.env.CONFIG_PATH || 'src/config.js'));

var compiler = webpack(webpackConfig);

var host = userConfig.host || 'localhost';
var port = parseInt(userConfig.port) + 1 || 3001;
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
