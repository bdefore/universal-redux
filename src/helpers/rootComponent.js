import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';

export function createForServer(store, renderProps) {
  return new Promise((resolve, reject) => {
    loadOnServer(renderProps, store)
      .then(() => {
        const root = (
          <Provider store={store} key="provider">
            <div>
              <ReduxAsyncConnect {...renderProps} />
            </div>
          </Provider>
        );
        resolve({ root });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function createForClient(store, { routes, history, devComponent }) {
  const component = (
    <Router render={(props) => <ReduxAsyncConnect {...props} />} history={history}>
      {routes}
    </Router>
  );
  const root = (
    <Provider store={store} key="provider">
      <div>
        {component}
        {devComponent}
      </div>
    </Provider>
  );

  return Promise.resolve({ root });
}
