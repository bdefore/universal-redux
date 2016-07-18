import { includes } from 'lodash';
import reduxAsyncConnectServer from './providers/redux-async-connect';
import asyncPropsServer from './providers/async-props';

export default function(store, renderProps, providers) {
  let server = reduxAsyncConnectServer;
  if (includes(providers, 'async-props')) {
    server = asyncPropsServer;
  }
  if (includes(providers, 'fmp-redux-async-connect')) {
    server = reduxAsyncConnectServer;
  }
  return server(store, renderProps);
}
