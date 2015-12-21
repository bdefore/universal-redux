// require('babel/polyfill');

// begin shared setup
var path = require('path');
var webpack = require('webpack');
var relativeAssetsPath = '../static/dist';
var assetsPath = path.join(__dirname, relativeAssetsPath);

// begin dev setup
var fs = require('fs');
var host = (process.env.HOST || 'localhost');
var port = parseInt(process.env.PORT) + 1 || 3001;

// begin prod setup
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');

var babelrc = fs.readFileSync(path.resolve(__dirname, '..', './.babelrc'));
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

if (process.env.NODE_ENV !== 'production') {

  var hmrConfig = [
      "react-transform", {
        "transforms": [
          {
            "transform": "react-transform-hmr",
            "imports": ["react"],
            "locals": ["module"]
          },
          {
            "transform": "react-transform-catch-errors",
            "imports": ["react", "redbox-react"]
          }
        ]
      }
    ]

  babelrcObject.env.development.plugins.unshift(hmrConfig);

  var jsLoaders = ['babel-loader?' + JSON.stringify(babelrcObject)];
} else {
  var jsLoaders = [strip.loader('debug'), 'babel-loader?' + JSON.stringify(babelrcObject)];
}

module.exports = {
  common: {
    context: path.resolve(__dirname, '..'),
    entry: {
      'main': [
        path.resolve(__dirname, '..', 'lib/client.js')
      ]
    },
    output: {
      path: assetsPath,
    },
    module: {
      loaders: [
        { test: /\.jsx?$/, exclude: /node_modules/, loaders: jsLoaders },
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
        { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
      ]
    },
    progress: true,
    resolve: {
      modulesDirectories: [
        'src',
        'node_modules',
        'node_modules/universal-redux/node_modules'
      ],
      extensions: ['', '.json', '.js', '.jsx']
    },
    resolveLoader: {
      modulesDirectories: [
        'src',
        'node_modules',
        'node_modules/universal-redux/node_modules'
      ]
    }
  },
  development: {
    devtool: 'inline-source-map',
    entry: {
      'main': [
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
        { test: /\.css$/, loader: "style!css" },
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
    output: {
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: '/dist/'
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css')},
        { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap=true&sourceMapContents=true') },
        { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true') }
      ]
    },
    plugins: [
      new CleanPlugin([relativeAssetsPath]),

      // css files from the extract-text-plugin loader
      new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
      new webpack.DefinePlugin({
        __CLIENT__: true,
        __SERVER__: false
      }),

      // set global vars
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
      })
    ]
  }
}
