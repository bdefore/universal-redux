import { includes } from 'lodash';
import reduxAsyncConnectClient from './providers/redux-async-connect';
import asyncPropsClient from './providers/async-props';

/**
 * @param {Object} store - Redux store
 * @param {String[]} providers - Array of provider type strings ('async-props' | 'redux-async-connect')
 * @param {Object} asyncHelpers - redux-async-connect helpers to be added to async connect
 * @param {Component} devComponent - React component that is added at development time (redux dev tools)
 */
export default function(store, providers, asyncHelpers, devComponent) {
  let client = reduxAsyncConnectClient;
  if (includes(providers, 'async-props')) {
    client = asyncPropsClient;
  }
  if (includes(providers, 'redux-async-connect')) {
    client = reduxAsyncConnectClient;
  }

  return client(store, asyncHelpers, devComponent);
}
