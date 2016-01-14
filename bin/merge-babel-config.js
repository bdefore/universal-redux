const fs = require('fs');
const strip = require('strip-loader');
const path = require('path');
const util = require('util');
const isProduction = process.env.NODE_ENV !== 'production';

function loadAndParse(filePath) {
  const file = fs.readFileSync(filePath);
  return JSON.parse(file);
}

module.exports = (userBabelConfig, verbose) => {
  const baseBabelConfig = loadAndParse(path.resolve(__dirname, '..', './.babelrc'));
  const babelConfig = userBabelConfig ? Object.assign(baseBabelConfig, loadAndParse(path.resolve(userBabelConfig))) : baseBabelConfig;

  const hmrConfig = [
    'react-transform', {
      transforms: [
        {
          transform: 'react-transform-hmr',
          imports: ['react'],
          locals: ['module']
        },
        {
          transform: 'react-transform-catch-errors',
          imports: ['react', 'redbox-react']
        }
      ]
    }
  ];

  babelConfig.env.development.plugins.unshift(hmrConfig);

  const babelLoader = 'babel-loader?' + JSON.stringify(babelConfig);
  const jsLoaders = isProduction ? [strip.loader('debug'), babelLoader] : [babelLoader];

  // output configuration files if user wants verbosity
  if (verbose) {
    const utilOptions = {
      depth: 10,
      colors: true
    };

    console.log('\nBabel config:');
    console.log(util.inspect(babelConfig, utilOptions));
  }

  return jsLoaders;
};
