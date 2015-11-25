var path = require('path');
var projectRoot = path.resolve(__dirname); 
var sourceRoot = path.resolve(__dirname, 'src');
console.log('overrides path', sourceRoot);
console.log('context', projectRoot);

module.exports = {
  // context: projectRoot,
  resolve: {
    root: [
      sourceRoot
    ],
    alias: {
      routes: sourceRoot + '/routes.js',
      config: sourceRoot + '/config.js',
      reducers: sourceRoot + '/redux/modules/reducer.js'
    }
  }
};
