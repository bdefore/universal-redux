import { createForClient as reduxAsyncConnectClient, createForServer as reduxAsyncConnectServer } from '../providers/redux-async-connect';
import { createForClient as asyncPropsClient, createForServer as asyncPropsServer } from '../providers/async-props';

export function createForClient(store, { routes, history, devComponent }, dataLoader) {
  switch (dataLoader) {
    case 'async-props':
      return asyncPropsClient(store, { routes, history, devComponent }, dataLoader);
    case 'redux-async-connect':
    default:
      return reduxAsyncConnectClient(store, { routes, history, devComponent });
  }
}

export function createForServer(store, renderProps, dataLoader) {
  switch (dataLoader) {
    case 'async-props':
      return asyncPropsServer(store, renderProps);
    case 'redux-async-connect':
    default:
      return reduxAsyncConnectServer(store, renderProps);
  }
}
