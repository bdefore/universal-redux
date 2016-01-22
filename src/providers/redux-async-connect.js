import React from 'react';
import { Provider } from 'react-redux';
import { createForClient as createRouterForClient } from './react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';

export function createForClient(store, { devComponent }) {
  const root = (
    <Provider store={store} key="provider">
      {createRouterForClient(store)}
      {devComponent}
    </Provider>
  );

  return Promise.resolve({ root });
}

export function createForServer(store, renderProps) {
  return new Promise((resolve, reject) => {
    loadOnServer(renderProps, store)
      .then(() => {
        const root = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );
        resolve({ root });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
