var Express = require('express');
var webpack = require('webpack');
var path = require('path');
var merge = require('../node_modules/webpack-config-merger');

var config = require(path.resolve(process.env.CONFIG_PATH));
var webpackConfig = require('./dev.config');

if (process.env.WEBPACK_OVERRIDES_PATH) {
  console.log('Overriding webpack config with those specified at ', process.env.WEBPACK_OVERRIDES_PATH);
  var overrides = require(path.resolve(process.env.WEBPACK_OVERRIDES_PATH));
  webpackConfig = merge(webpackConfig, overrides);
} else {
  console.log('No webpack config overrides specified.')
}
console.log('Webpack config:', webpackConfig);
var compiler = webpack(webpackConfig);

var host = config.host || 'localhost';
var port = (config.port + 1) || 3001;
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
