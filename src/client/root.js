import { includes } from 'lodash';
import reduxAsyncConnectClient from './providers/redux-async-connect';
import reactRouterScroll from './providers/react-router-scroll';
import asyncPropsClient from './providers/async-props';

export default function (store, providers, devComponent) {
  let client = reduxAsyncConnectClient;
  if (includes(providers, 'react-router-scroll')) {
    client = reactRouterScroll;
  }
  if (includes(providers, 'async-props')) {
    client = asyncPropsClient;
  }
  if (includes(providers, 'fmp-redux-async-connect')) {
    client = reduxAsyncConnectClient;
  }

  return client(store, devComponent);
}
