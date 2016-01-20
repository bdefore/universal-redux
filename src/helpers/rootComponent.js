import React from 'react';
import { Provider } from 'react-redux';
import { RouterContext, Router } from 'react-router';

export function createForServer(store, renderProps) {
  const root = (
    <Provider store={store} key="provider">
      <div>
        <RouterContext {...renderProps} />
      </div>
    </Provider>
  );
  return Promise.resolve({root});
}

export function createForClient(store, {routes, history, devComponent}) {
  const component = (
    <Router history={history}>
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

  return Promise.resolve({root});
}
