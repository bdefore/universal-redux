import { createForClient as reduxAsyncConnectClient, createForServer as reduxAsyncConnectServer } from '../providers/redux-async-connect';

export function createForClient(dataLoader, store, { routes, history, devComponent }) {
  switch (dataLoader) {
    default:
      return reduxAsyncConnectClient(store, { routes, history, devComponent });
  }
}

export function createForServer(dataLoader, store, renderProps) {
  switch (dataLoader) {
    default:
      return reduxAsyncConnectServer(store, renderProps);
  }
}
