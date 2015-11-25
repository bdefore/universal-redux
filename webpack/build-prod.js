var webpack = require('webpack');
var path = require('path');
var merge = require('../node_modules/webpack-config-merger');

var config = require(path.resolve(process.env.CONFIG_PATH));
var webpackConfig = require('./prod.config');

if (process.env.WEBPACK_OVERRIDES_PATH) {
  console.log('Overriding webpack config with those specified at ', process.env.WEBPACK_OVERRIDES_PATH);
  var overrides = require(path.resolve(process.env.WEBPACK_OVERRIDES_PATH));
  webpackConfig = merge(webpackConfig, overrides);
} else {
  console.log('No webpack config overrides specified.')
}

// for setting up HMR in redux/create
webpackConfig.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    SOURCE_ROOT: JSON.stringify(webpackConfig.resolve.root)
  }
}));

console.log('Webpack config:', webpackConfig);
webpack(webpackConfig, function(err, stats) {
  console.log('Webpack build completed. Error?', err);
});
