'use strict';
/* eslint no-var:0, func-names:0 */
var path = require('path');
var devDependencies = require('../package.json').devDependencies;
var install = [];
var npmPackage;
var npm;

// return if not installed as a module
if (process.env.PWD.split('/').indexOf('node_modules') === -1) {
  return;
}

// Return if not installed via npm
if (process.env.npm_execpath === undefined) {
  return;
}

// return if production mode
if ((process.env.NODE_ENV === 'production') || (process.env.npm_config_production === 'true')) {
  return;
}

// See https://github.com/npm/npm/blob/master/bin/npm-cli.js L#26
npm = require(path.resolve(path.dirname(process.env.npm_execpath), '../lib') + '/npm.js');


for (npmPackage in devDependencies) {
  if (devDependencies.hasOwnProperty(npmPackage)) {
    install.push(npmPackage + '@' + devDependencies[npmPackage]);
  }
}

if (install[0] === undefined) {
  return;
}

npm.load({}, function (error) {
  if (error) {
    console.log('NPM error', error);
    throw new Error(error);
  }

  npm.commands.install(install, function (installError) {
    if (installError) {
      console.log('NPM install error', installError);
      throw new Error(installError);
    }
  });
});
