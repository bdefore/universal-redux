'use strict';
/* eslint no-var:0, func-names:0 */
var spawn = require('child_process').spawn;
var devDependencies = require('../package.json').devDependencies;
var install = ['install'];
var npmPackage;
var npm;

// return if not installed as a module
if (process.env.PWD.split('/').indexOf('node_modules') === -1) {
  return;
}

if (process.env.npm_execpath === undefined) {
  return;
}

if (process.env.custom_npm_postinstall) {
  return;
}

// return if production mode
if ((process.env.NODE_ENV === 'production') || (process.env.npm_config_production === 'true')) {
  return;
}

for (npmPackage in devDependencies) {
  if (devDependencies.hasOwnProperty(npmPackage)) {
    install.push(npmPackage + '@' + devDependencies[npmPackage]);
  }
}

if (install[1] === undefined) {
  return;
}

process.env.custom_npm_postinstall = 'true';
console.log(process.env.npm_package_name, 'installing devDependencies. This might take a bit.');
npm = spawn('npm', install, {
  env: process.env,
  cwd: process.env.HOME,
  stdio: ['pipe', process.stdout, 'pipe']
});

if (npm.stdout && npm.stdout.pipe !== null) {
  npm.stdout.pipe(process.stdout);
}

