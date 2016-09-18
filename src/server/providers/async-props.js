import React from 'react';
import { Provider } from 'react-redux';
import AsyncProps, { loadPropsOnServer } from '../../vendor/async-props';

export default function (store, renderProps) {
  return new Promise((resolve, reject) => {
    loadPropsOnServer(renderProps, (err, asyncProps) => {
      if (err) {
        reject(err);
      }
      const root = (
        <Provider store={store} key="provider">
          <div>
            <AsyncProps {...renderProps} {...asyncProps} />
          </div>
        </Provider>
      );
      resolve(root);
    });
  });
}
