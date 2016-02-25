'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var util = require('util');

exports.default = function (obj) {
  var utilOptions = {
    depth: 12,
    colors: true
  };

  console.log(util.inspect(obj, utilOptions));
};