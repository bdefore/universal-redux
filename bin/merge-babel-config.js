var fs = require('fs');
var strip = require('strip-loader');
var path = require('path');
var util = require('util');

module.exports = function(userBabelConfig, verbose) {

  var babelrc = fs.readFileSync(path.resolve(__dirname, '..', './.babelrc'));
  var babelConfig = {};
  var jsLoaders;

  try {
    babelConfig = JSON.parse(babelrc);
  } catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.');
    console.error(err);
  }

  if(userBabelConfig) {
    console.log('Merging universal-redux Babel defaults with project Babel configuration');

    var userBabelConfigFile = fs.readFileSync(path.resolve(userBabelConfig));
    var userBabelConfig = {};

    try {
      userBabelConfig = JSON.parse(userBabelConfigFile);
    } catch (err) {
      console.error('==>     ERROR: Error parsing your project-level Babel configuration.');
      console.error(err);
    }

    babelConfig = Object.assign(babelConfig, userBabelConfig);
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

    babelConfig.env.development.plugins.unshift(hmrConfig);

    jsLoaders = ['babel-loader?' + JSON.stringify(babelConfig)];
  } else {
    jsLoaders = [strip.loader('debug'), 'babel-loader?' + JSON.stringify(babelConfig)];
  }

  // output configuration files if user wants verbosity
  if(verbose) {
    var utilOptions = {
      depth: 10,
      colors: true
    };

    console.log('Babel config:');
    console.log(util.inspect(babelConfig, utilOptions));
  }

  return jsLoaders;
}
