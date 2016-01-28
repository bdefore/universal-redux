// require('babel/polyfill');

// begin shared setup
const path = require('path');
const webpack = require('webpack');

// begin dev setup
const host = (process.env.HOST || 'localhost');
const port = parseInt(process.env.PORT, 10) + 1 || 3001;

// begin prod setup
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const vendor = [
  'lodash',
  'react',
  'react-dom',
  'react-router',
  'react-redux',
  'redux',
  'redux-logger',
  'react-router-redux'
];

module.exports = {
  common: {
    context: path.resolve(__dirname, '..'),
    entry: {
      main: [
        path.resolve(__dirname, '..', 'lib/client.js')
      ]
    },
    module: {
      loaders: [
        // { test: /\.jsx?$/, exclude: /node_modules/, loaders: jsLoaders }, // now prepended in merge-configs and merge-babel-config
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
        { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
      ]
    },
    progress: true,
    resolve: {
      modulesDirectories: [
        'src',
        'node_modules'
      ],
      extensions: [ '', '.json', '.js', '.jsx' ]
    },
    resolveLoader: {
      modulesDirectories: [
        'src',
        'node_modules'
      ]
    }
  },
  development: {
    devtool: 'inline-source-map',
    entry: {
      main: [
        'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      ]
    },
    output: {
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: 'http://' + host + ':' + port + '/dist/'
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: 'style!css' },
        { test: /\.less$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap' },
        { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap' }
      ]
    },
    plugins: [
      // hot reload
      new webpack.HotModuleReplacementPlugin(),
      new webpack.IgnorePlugin(/webpack-assets\.json$/),
      new webpack.DefinePlugin({
        __CLIENT__: true,
        __SERVER__: false
      })
    ]
  },
  production: {
    devtool: 'source-map',
    entry: {
      vendor
    },
    output: {
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: '/dist/'
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
        { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap=true&sourceMapContents=true') },
        { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true') }
      ]
    },
    plugins: [
      // css files from the extract-text-plugin loader
      new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true }),
      new webpack.DefinePlugin({
        __CLIENT__: true,
        __SERVER__: false
      }),

      // set global consts
      new webpack.DefinePlugin({
        'process.env': {
          // Useful to reduce the size of client-side libraries, e.g. react
          NODE_ENV: JSON.stringify('production')
        }
      }),

      // optimizations
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: [ 'vendor' ],
        minChunks: Infinity
      })
    ]
  }
};
