import React from 'react';
import { Provider } from 'react-redux';
import AsyncProps, { loadPropsOnServer } from '../../vendor/async-props';

export default function(store, renderProps) {
  return new Promise((resolve, reject) => {
    loadPropsOnServer(renderProps, (err, asyncProps) => {
      if (err) {
        reject(err);
      }
      const root = (
        <Provider store={store} key="provider">
          <AsyncProps {...renderProps} {...asyncProps} />
        </Provider>
      );
      resolve({ root });
    });
  });
}
