/* eslint-disable */
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(__dirname, '../src');

module.exports = Object.assign({

  /*
  // The host to run the Express universal renderer. See src/server.js.
  //
  // Expects: String
  */
  host: process.env.HOST || 'http://localhost',

  /*
  // The port to run Express universal renderer will run on. See src/server.js.
  //
  // Expects: Number
  */
  port: process.env.PORT || 3000,

  /*
  // The prefix that will be prepending for all calls intended for an external API
  //
  // Expects: String
  */ 
  apiPrefix: 'api',

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
  },

  /*
  // Enable eslint checks per Webpack build. Will not be run
  // on production.
  //
  // Expects: Boolean
  */  
  lint: true,

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
  // Webpack configuration cusomtizations. These properties will
  // be merged with the corresponding default configurations for
  // the Node environment, using webpack-config-merger. Properties
  // with the same name will be overwritten. Arrays will be
  // concatenated. Objects will be merged. There are more parameters
  // available than specified here. For the full list, see 
  // https://webpack.github.io/docs/configuration.html.
  */  
  webpack: {

    /*
    // The Webpack devtool configuration. May affect build times.
    // See https://webpack.github.io/docs/configuration.html#devtool
    */
    devtool: 'inline-eval-cheap-source-map',

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

      alias: {

        /*
        // The react-router Routes file, Required.
        */
        routes: sourceRoot + '/routes.js',

        /*
        // The path to the index of your Redux reducers. Required.
        */
        reducers: sourceRoot + '/redux/modules/reducer.js',

        /*
        // The path to your replacement for the default HTML shell. Optional.
        // If not provided, the default used will be that in src/helpers/Html.js.
        */
        html: sourceRoot + '/helpers/Html.js'
      }
    }
  },

  /*
  // Metadata for the site
  */  
  app: {
    title: 'Redux Universal Render App',
    description: 'Lorem Ipsum'
  }

});
/* eslint-enable */
