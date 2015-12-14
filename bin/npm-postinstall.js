'use strict';
/* eslint no-var:0, func-names:0 */

var path = require('path');

// See npm-cli.js L#26
var npmPath = path.resolve(path.dirname(process.env.npm_execpath), '../lib');
var npm = require(npmPath + '/npm.js');

var devDependencies = require('../package.json').devDependencies;
var install = [];
var npmPackage;

if ((process.env.NODE_ENV === 'production') || (process.env.npm_config_production === 'true')) {
  return;
}

for (npmPackage in devDependencies) {
  if (devDependencies.hasOwnProperty(npmPackage)) {
    install.push(npmPackage + '@' + devDependencies[npmPackage]);
  }
}

if (install[0] === undefined) {
  return;
}

console.log(process.env);

npm.load({}, function(error) {
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
