'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactRouter = require('./providers/react-router');

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _create = require('../shared/create');

var _create2 = _interopRequireDefault(_create);

var _configure = require('../configure');

var _configure2 = _interopRequireDefault(_configure);

var _html = require('./html');

var _html2 = _interopRequireDefault(_html);

var _tools = require('./tools');

var _tools2 = _interopRequireDefault(_tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false; // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

exports.default = function (projectConfig, projectToolsConfig) {
  var _marked = [koaMiddleware].map(_regenerator2.default.mark);

  var tools = (0, _tools2.default)(projectConfig, projectToolsConfig);
  var config = (0, _configure2.default)(projectConfig);
  var rootComponentPath = config.rootServerComponent || config.rootComponent || __dirname + '/root';
  var rootServerComponent = require(_path2.default.resolve(rootComponentPath)).default;
  var getRoutes = require(_path2.default.resolve(config.routes)).default;
  var pretty = new _prettyError2.default();

  var dynamicMiddleware = function dynamicMiddleware(originalUrl, headers, send, redirect) {
    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      tools.refresh();
    }

    var middleware = config.redux.middleware ? require(_path2.default.resolve(config.redux.middleware)).default : [];
    var store = (0, _create2.default)(middleware);
    var routes = getRoutes(store);

    if (__DISABLE_SSR__) {
      var _ret = function () {
        var content = (0, _html2.default)(config, tools.assets(), store, headers);
        return {
          v: new _promise2.default(function (resolve) {
            return send(200, content, resolve);
          }).then(function () {})
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
    }
    return new _promise2.default(function (resolve) {
      (0, _reactRouter.match)(routes, originalUrl, store, function (error, redirectLocation, renderProps) {
        if (redirectLocation) {
          redirect(redirectLocation.pathname + redirectLocation.search, resolve);
        } else if (error) {
          console.error('ROUTER ERROR:', pretty.render(error));
          send(500, resolve);
        } else if (renderProps) {
          rootServerComponent(store, renderProps, config.providers).then(function (_ref) {
            var root = _ref.root;

            var content = (0, _html2.default)(config, tools.assets(), store, headers, root);
            send(200, content, resolve);
          }).catch(function (err) {
            console.log('ERROR GENERATING ROOT COMPONENT', err, err.stack);
            send(500, err, resolve);
          });
        } else {
          send(404, 'Not found', resolve);
        }
      });
    }).then(function () {});
  };

  function koaMiddleware() {
    var _this = this;

    return _regenerator2.default.wrap(function koaMiddleware$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return dynamicMiddleware(this.request.originalUrl, this.request.headers, function (status, body, resolve) {
              _this.status = status;
              _this.body = body;
              resolve();
            }, function (url, resolve) {
              _this.response.redirect(url);
              resolve();
            });

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _marked[0], this);
  }

  switch (config.server.webFramework) {
    case 'koa':
      {
        return koaMiddleware;
      }
    default:
    case 'express':
      {
        return function (req, res) {
          dynamicMiddleware(req.originalUrl, res._headers, function (status, body) {
            return res.status(status).send(body);
          }, function (url) {
            return res.redirect(url);
          });
        };
      }
  }
};