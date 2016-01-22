import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import AsyncProps, { loadPropsOnServer } from '../vendor/async-props';

export function createForClient(store, { routes, history, devComponent }) {
  const root = (
    <Provider store={store} key="provider">
      <div>
        <Router render={(props) => <AsyncProps {...props} />} history={history}>
          {routes}
        </Router>
        {devComponent}
      </div>
    </Provider>
  );

  return Promise.resolve({ root });
}

export function createForServer(store, renderProps) {
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
