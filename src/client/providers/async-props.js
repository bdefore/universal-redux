import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import AsyncProps from '../../vendor/async-props';

export default function(store, { routes, history, devComponent }) {
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
