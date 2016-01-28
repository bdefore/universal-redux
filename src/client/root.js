import { includes } from 'lodash';
import reduxAsyncConnectClient from './providers/redux-async-connect';
import asyncPropsClient from './providers/async-props';

export default function(store, { devComponent }, providers) {
  let client = reduxAsyncConnectClient;
  if (includes(providers, 'async-props')) {
    client = asyncPropsClient;
  }
  if (includes(providers, 'redux-async-connect')) {
    client = reduxAsyncConnectClient;
  }

  return client(store, { devComponent });
}
