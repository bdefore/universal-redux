//  enable runtime transpilation to use ES6/7 in node

/* eslint-disable */
var fs = require('fs');
var path = require('path');

var babelrc = fs.readFileSync(path.resolve(__dirname, '../.babelrc'));
var config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your babelrc');
  console.error(err);
}
/* eslint-enable */

require('babel-core/register')(config);
