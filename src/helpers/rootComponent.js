import { includes } from 'lodash';
import { createForClient as reduxAsyncConnectClient, createForServer as reduxAsyncConnectServer } from '../providers/redux-async-connect';
import { createForClient as asyncPropsClient, createForServer as asyncPropsServer } from '../providers/async-props';

export function createForClient(store, { routes, history, devComponent }, providers) {
  let client = reduxAsyncConnectClient;
  if (includes(providers, 'async-props')) {
    client = asyncPropsClient;
  }
  if (includes(providers, 'redux-async-connect')) {
    client = reduxAsyncConnectClient;
  }

  return client(store, { routes, history, devComponent });
}

export function createForServer(store, renderProps, providers) {
  let server = reduxAsyncConnectServer;
  if (includes(providers, 'async-props')) {
    server = asyncPropsServer;
  }
  if (includes(providers, 'redux-async-connect')) {
    server = reduxAsyncConnectServer;
  }
  return server(store, renderProps);
}
