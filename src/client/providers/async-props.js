import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import getRoutes from 'universal-redux/routes';
import AsyncProps from '../../vendor/async-props';

/**
 * @param store
 * @param asyncHelpers - Ignored by async-props
 * @param devComponent
 * @returns {Promise.<Provider>}
 */
export default function(store, asyncHelpers, devComponent) {
  const root = (
    <Provider store={store} key="provider">
      <div>
        <Router render={(props) => <AsyncProps {...props} />} history={history}>
          {getRoutes(store)}
        </Router>
        {devComponent}
      </div>
    </Provider>
  );

  return Promise.resolve(root);
}
