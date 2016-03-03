import React from 'react';
import { Provider } from 'react-redux';
import createRouter from './react-router';

/**
 * @param store - Redux store
 * @param asyncHelpers - A resolved helpers object
 * @param devComponent
 * @returns {Promise.<Provider>}
 */
export default function(store, asyncHelpers, devComponent) {
  const root = (
    <Provider store={store} key="provider">
      <div>
        {createRouter(store, asyncHelpers)}
        {devComponent}
      </div>
    </Provider>
  );

  return Promise.resolve(root);
}
