'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = match;

var _reactRouter = require('react-router');

var _createMemoryHistory = require('react-router/lib/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function match(routes, location, store, cb) {
  (0, _reactRouter.match)({ history: (0, _createMemoryHistory2.default)(), routes: routes, location: location }, cb);
}