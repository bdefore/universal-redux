'use strict';
/* eslint no-var:0, func-names:0 */

var path = require('path');
var npmPath = path.resolve(path.dirname(process.env.npm_execpath), '../');
var npm = require(npmPath);
var webDevDependencies = require('../package.json').webDevDependencies;
var install = [];
var npmPackage;

if ((process.env.NODE_ENV === 'production') || (process.env.npm_config_production === 'true')) {
  return;
}

if (!process.env.npm_execpath) {
  throw new Error('Cannot find NPM package to install webDevDependencies');
}

for (npmPackage in webDevDependencies) {
  if (webDevDependencies.hasOwnProperty(npmPackage)) {
    install.push(npmPackage + '@' + webDevDependencies[npmPackage]);
  }
}

npm.load({loaded: false}, function(error) {
  if (error) {
    console.log('NPM error', error);
    throw new Error(error);
  }

  npm.commands.install(install, function(installError) {
    if (installError) {
      console.log('NPM install error', installError);
      throw new Error(installError);
    }
  });
});
