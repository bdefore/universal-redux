'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetchAllData(components, getState, dispatch, location, params, deferred) {
  var methodName = deferred ? 'fetchDataDeferred' : 'fetchData';
  return components.filter(function (component) {
    return !!component;
  }) // Weed out 'undefined' routes
  .filter(function (component) {
    return component[methodName];
  }) // only look at ones with a static fetchData()
  .map(function (component) {
    return component[methodName];
  }) // pull out fetch data methods
  .map(function (fetchData) {
    return fetchData(getState, dispatch, location, params);
  }); // call fetch data methods and save promises
}

exports.default = function (components, getState, dispatch, location, params) {
  return new _promise2.default(function (resolve) {
    var doTransition = function doTransition() {
      _promise2.default.all(fetchAllData(components, getState, dispatch, location, params, true)).then(resolve).catch(function (error) {
        // TODO: You may want to handle errors for fetchDataDeferred here
        console.warn('Warning: Error in fetchDataDeferred', error);
        return resolve();
      });
    };

    _promise2.default.all(fetchAllData(components, getState, dispatch, location, params)).then(doTransition).catch(function (error) {
      // TODO: You may want to handle errors for fetchData here
      console.warn('Warning: Error in fetchData', error);
      return doTransition();
    });
  });
};