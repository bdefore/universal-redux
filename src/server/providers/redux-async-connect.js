import React from 'react';
import { Provider } from 'react-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';

/**
 * Root component generation function
 *
 * @param store
 * @param asyncHelpers
 * @param renderProps
 * @returns {Promise} A wrapping promise, which resolves after <loadOnServer> is completed
 */
export default function(store, asyncHelpers, renderProps) {
  return new Promise((resolve, reject) => {
    loadOnServer({...renderProps, store})
      .then(() => {
        const root = (
          <Provider store={store} key="provider">
            <div>
              <ReduxAsyncConnect {...renderProps} helpers={asyncHelpers}/>
            </div>
          </Provider>
        );
        resolve(root);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
