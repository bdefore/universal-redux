#!/usr/bin/env node
const path = require('path');
const util = require('util');

const lodash = require('lodash');
const webpack = require('webpack');
const mergeBabel = require('./merge-babel-config');
const mergeWebpack = require('webpack-config-merger');
const baseWebpackConfig = require('../config/webpack.config.js');
const baseDevConfig = mergeWebpack(baseWebpackConfig.common, baseWebpackConfig.development);
const baseProdConfig = mergeWebpack(baseWebpackConfig.common, baseWebpackConfig.production);
const baseToolsConfig = require('../config/webpack-isomorphic-tools.config.js');
const WebpackErrorNotificationPlugin = require('webpack-error-notification');

const isProduction = process.env.NODE_ENV === 'production';
const hooks = require('../lib/hooks');

function inspect(obj) {
  const utilOptions = {
    depth: 12,
    colors: true
  };

  console.log(util.inspect(obj, utilOptions));
}

module.exports = (userConfig) => {
  // derive root and sourceDir, alowing for absolute, relative, or not provided
  const root = userConfig.root ? userConfig.root[0] === '/' ? userConfig.root : path.resolve(__dirname, '../..', userConfig.root) : path.resolve(__dirname, '../../..');
  const sourceDir = userConfig.sourceDir ? userConfig.sourceDir[0] === '/' ? userConfig.sourceDir : path.resolve(root, userConfig.sourceDir) : path.resolve(root, './src');

  // merge with base config
  const universalReduxConfig = lodash.merge(require('../config/universal-redux.config.js')(root, sourceDir), userConfig);

  // merge with base webpack config
  const baseConfig = isProduction ? baseProdConfig : baseDevConfig;
  const combinedWebpackConfig = mergeWebpack(baseConfig, universalReduxConfig.webpack.config);
  combinedWebpackConfig.context = root;
  combinedWebpackConfig.resolve.root = sourceDir;

  // derive webpack output destination from staticPath
  combinedWebpackConfig.output.path = universalReduxConfig.server.staticPath + '/dist';

  // add babel for js transpiling
  const babelConfig = mergeBabel(universalReduxConfig.babelConfig, universalReduxConfig.verbose);
  combinedWebpackConfig.module.loaders.unshift({ test: /\.jsx?$/, exclude: /node_modules/, loaders: babelConfig });

  // gather tools config
  const userToolsConfig = require(path.resolve(universalReduxConfig.toolsConfigPath));
  const combinedToolsConfig = lodash.merge(baseToolsConfig, userToolsConfig);

  // bury it here rather than pollute the project directory
  combinedToolsConfig.webpack_assets_file_path = 'node_modules/universal-redux/webpack-assets.json';

  // add tools settings to combined weback config
  const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
  const toolsPlugin = new WebpackIsomorphicToolsPlugin(combinedToolsConfig);

  combinedWebpackConfig.module.loaders.push({ test: toolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' });
  combinedWebpackConfig.plugins.push(isProduction ? toolsPlugin : toolsPlugin.development());

  // turn on linting per webpack build, unless directed not to
  if (universalReduxConfig.lint.enabled !== false && !isProduction) {
    combinedWebpackConfig.module.loaders[0].loaders.push('eslint-loader');
    const lintConfigPath = universalReduxConfig.lint.config || path.resolve(__dirname, '../.eslintrc');
    combinedWebpackConfig.eslint = {
      configFile: lintConfigPath
    };
  }

  // turn on desktop notifications if user elects to
  if (universalReduxConfig.notifications === true && !isProduction) {
    combinedWebpackConfig.plugins.push(new WebpackErrorNotificationPlugin());
  }

  // add default settings that are used by server via process.env
  const definitions = {
    __DEVELOPMENT__: !isProduction
  };

  // override with user settings
  lodash.each(universalReduxConfig.globals, (value, key) => { definitions[key] = JSON.stringify(value); });
  combinedWebpackConfig.plugins.push(new webpack.DefinePlugin(definitions));

  // add routes and reducer aliases so that client has access to them
  combinedWebpackConfig.resolve.alias = combinedWebpackConfig.resolve.alias || {};
  combinedWebpackConfig.resolve.alias.routes = universalReduxConfig.routes;
  if (universalReduxConfig.redux.middleware) {
    combinedWebpackConfig.resolve.alias.middleware = universalReduxConfig.redux.middleware;
  } else {
    combinedWebpackConfig.resolve.alias.middleware = path.resolve(__dirname, '../lib/helpers/empty.js');
  }

  // Try to resolve the configured plugins
  const isServer = typeof(__SERVER__) !== 'undefined' && __SERVER__;
  const plugins = universalReduxConfig.plugins
    .map((pluginKey) => {
      const pluginPath = [
        `universal-redux-plugin-${pluginKey}`,
        `${sourceDir}/${pluginKey}`
      ].find((pp) => {
        try {
          require.resolve(pp);
          return true;
        } catch (e) {
          if (e.code === 'MODULE_NOT_FOUND') return false;
          throw e;
        }
      });
      if (!pluginPath) {
        console.warn(`Could not resolve plugin ${pluginKey}`);
      } else {
        // Check that we even need the plugin in the current environment;
        const plugin = require(pluginPath);
        if (plugin.config && plugin.config.environments) {
          if ((plugin.config.environments.indexOf(hooks.environments.SERVER) !== -1 && !isServer) ||
              (plugin.config.environments.indexOf(hooks.environments.CLIENT) !== -1 && isServer) ||
              (plugin.config.environments.indexOf(hooks.environments.PRODUCTION) !== -1 && !isProduction) ||
              (plugin.config.environments.indexOf(hooks.environments.DEVELOPMENT) !== -1 && isProduction)) {
            return null;
          }
        }
        console.log(`Loaded universal-redux plugin '${pluginPath}'`);
      }
      return pluginPath;
    })
    .filter((pp) => !!pp);

  combinedWebpackConfig.entry.main.unshift(...plugins);

  // add project level vendor libs
  if (universalReduxConfig.webpack.vendorLibraries && isProduction) {
    lodash.each(universalReduxConfig.webpack.vendorLibraries, (lib) => {
      combinedWebpackConfig.entry.vendor.push(lib);
    });
  }

  // output configuration files if user wants verbosity
  if (universalReduxConfig.verbose) {
    console.log('\nWebpack config:');
    inspect(combinedWebpackConfig);
    console.log('\nIsomorphic tools config:');
    inspect(combinedToolsConfig);
  }

  universalReduxConfig.webpack.config = combinedWebpackConfig;

  return universalReduxConfig;
};
