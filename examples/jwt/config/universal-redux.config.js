/* eslint-disable */
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(__dirname, '../src');

module.exports = {

  /*
   // Express configuration
   */
  server: {
    /*
     // The host to run the Express universal renderer. See src/server.js.
     //
     // Expects: String
     */
    host: process.env.HOST || 'localhost',

    /*
     // The port to run Express universal renderer will run on. See src/server.js.
     //
     // Expects: Number
     */
    port: process.env.PORT || 3000
  },

  /*
   // Globals available to both serverside and clientside rendering.
   // You may also add your own here.
   */
  globals: {

    /*
     // Whether or not to run redux-logger
     //
     // Expects: Boolean
     */
    __LOGGER__: !isProduction,

    /*
     // Whether or not to run redux-devtools
     //
     // Expects: Boolean
     */
    __DEVTOOLS__: !isProduction,

    __API_ENDPOINT__: '/api'
  },

  /*
   // Enable eslint checks per Webpack build. Will not be run
   // on production.
   //
   // Expects: Boolean
   */
  lint: {
    enabled: false,
    config: projectRoot + '/.eslintrc'
  },

  // babelConfig: projectRoot + '/.babelrc',

  /*
   // Enable native desktop notifications for Webpack build events.
   // Will not be run on production.
   //
   // Expects: Boolean
   */
  notifications: true,

  /*
   // Path to a file with customizations for the default
   // webpack-isomorphic-tools configuration. Optional.
   //
   // Expects: String
   */
  // toolsConfigPath: __dirname + '/webpack-isomorphic-tools.config.js',

  /*
   // When eneabled, will output Webpack and Webpack Isomorphic
   // Tools configurations at startup
   //
   // Expects: Boolean
   */
  verbose: true,

  /*
   // The react-router Routes file, Required. Will be added to Webpack aliases.
   */
  routes: sourceRoot + '/routes.js',

  redux: {
    /*
     // The path to the index of your Redux reducers. Required. Will be added
     // to Webpack aliases.
     //
     // Expects: String
     */
    reducers: sourceRoot + '/redux/modules/index.js',

    /*
     // A path to an index of middleware functions. On the serverside, these will
     // be called with the Express request and response. Optional.
     //
     // Expects: String
     */
    middleware: sourceRoot + '/redux/middleware/index.js',
  },

  /*
   // The path to your replacement for the default HTML shell. Optional.
   // If not provided, the default used will be that in
   // src/containers/HtmlShell/HtmlShell.js. Will be added to Webpack aliases.
   */
  htmlShell: sourceRoot + '/containers/HtmlShell/HtmlShell.js',

  webpack: {

    /*
     // Whether to merge into the default webpack configuration using
     // webpack-config-merger.
     //
     // If the `merge` parameter is `true`, properties with the same name
     // will be overwritten. Arrays will be concatenated. Objects will
     // be merged.
     //
     // If the `merge` parameter is `false`, default webpack settings
     // will not be used and the config specified here will need to
     // be the complete settings required for building.
     */
    merge: true,

    /*
     // Webpack configuration cusomtizations. There are more parameters
     // available than specified here. For the full list, see
     // https://webpack.github.io/docs/configuration.html.
     */
    config: {

      /*
       // The Webpack devtool configuration. May affect build times.
       // See https://webpack.github.io/docs/configuration.html#devtool
       */
      devtool: isProduction ? 'source-map' : 'inline-eval-cheap-source-map',

      /*
       // Not recommended to change.
       */
      context: projectRoot,

      /*
       // Not recommended to change.
       */
      output: {

        /*
         // Not recommended to change.
         */
        path: projectRoot + '/static/dist'

      },

      resolve: {

        /*
         // Not recommended to change.
         */
        root: sourceRoot,

        extensions: [ '.scss' ] // use of import style from './style' in react-toolbox requires having it be a valid extension
      }
    }
  }
};
/* eslint-enable */