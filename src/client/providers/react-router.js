import React from 'react';
import { Router } from 'react-router';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect } from 'redux-async-connect';
import getRoutes from 'universal-redux/routes';

export default function(store) {
  const history = syncHistoryWithStore(browserHistory, store);
  const component = (
    <Router render={(props) => <ReduxAsyncConnect {...props} />} history={history}>
      {getRoutes(store)}
    </Router>
  );

  return component;
}
