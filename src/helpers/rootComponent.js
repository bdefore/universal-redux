import { createForClient as reduxAsyncConnectClient, createForServer as reduxAsyncConnectServer } from '../providers/redux-async-connect';
import { createForClient as asyncPropsClient, createForServer as asyncPropsServer } from '../providers/async-props';

export function createForClient(dataLoader, store, { routes, history, devComponent }) {
  switch (dataLoader) {
    case 'async-props':
      return asyncPropsClient(store, { routes, history, devComponent });
    case 'redux-async-connect':
    default:
      return reduxAsyncConnectClient(store, { routes, history, devComponent });
  }
}

export function createForServer(dataLoader, store, renderProps) {
  switch (dataLoader) {
    case 'async-props':
      return asyncPropsServer(store, renderProps);
    case 'redux-async-connect':
    default:
      return reduxAsyncConnectServer(store, renderProps);
  }
}
