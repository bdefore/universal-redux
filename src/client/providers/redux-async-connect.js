import React from 'react';
import { Provider } from 'react-redux';
import createRouter from './react-router';

export default function (store, devComponent) {
  const root = (
    <Provider store={store} key="provider">
      <div>
        {createRouter(store)}
        {devComponent}
      </div>
    </Provider>
  );

  return Promise.resolve(root);
}
