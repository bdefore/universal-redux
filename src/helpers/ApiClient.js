import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    const pathLib = require('path');
    const config = require(pathLib.resolve(process.env.SOURCE_ROOT, 'config'));
    apiPrefix = config.apiPrefix || 'api';

    return 'http://' + config.apiHost + ':' + config.apiPort + adjustedPath;
  }
  // Prepend api prefix to relative URL, to proxy to API server.
  return '/api' + adjustedPath;
}

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }

        request.end((err, res) => {
          if (err) {
            reject(res && res.body ? res.body : err);
          } else {
            resolve(res);
          }
        });

      }));
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
