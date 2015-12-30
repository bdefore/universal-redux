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
    port: process.env.PORT || 3000,

    /*
    // The path at which static assets are served from. If omitted, Express will
    // not serve any static assets. Optional.
    //
    // Expects: String
    */
    // staticPath: projectRoot + '/static',

    /*
    // The path at which a favicon image will be served from using the `serve-favicon`
    // library. If omitted, Express will not serve a favicon. Optional.
    //
    // Expects: String
    */
    // favicon: projectRoot + '/static/favicon.ico',

    /*
    // The maximum age, in milliseconds, for which a static asset will be
    // considered fresh, per the Cache-Control max-age property. If
    // ommitted, defaults to 0.
    //
    // Expects: Number
    */
    maxAge: 0
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
    __DEVTOOLS__: !isProduction
  },

  /*
  // Enable eslint checks per Webpack build. Will not be run
  // on production.
  //
  // Expects: Boolean
  */
  lint: {
    enabled: true
    // config: projectRoot + '/.eslintrc'
  },

  /*
  // Project level babelConfig to be merged with defaults. Optional.
  //
  // Expects: String
  */
  babelConfig: projectRoot + '/.babelrc',

  /*
  // Enable native desktop notifications for Webpack build events.
  // Will not be run on production.
  //
  // Expects: Boolean
  */
  notifications: false,

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
    // middleware: sourceRoot + '/redux/middleware/index.js',
  },

  /*
  // The path to your replacement for the default HTML shell. Optional.
  // If not provided, the default used will be that in
  // src/containers/HtmlShell/HtmlShell.js. Will be added to Webpack aliases.
  //
  // Expects: String
  */
  // htmlShell: sourceRoot + '/containers/HtmlShell/HtmlShell.js',

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
    // A list of libraries that do not change frequently between deploys
    // and are best served in the vendor bundle.
    //
    // Expects: Array
    */
    vendorLibraries: [],

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
        // Ensure this maps to the source root of your project, not that of
        // Universal Redux
        */
        root: sourceRoot
      }
    }
  }
};
