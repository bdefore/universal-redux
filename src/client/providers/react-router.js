import React from 'react';
import { Router } from 'react-router';
import { browserHistory } from 'react-router';
import { ReduxAsyncConnect } from 'redux-async-connect';
import getRoutes from 'routes';

export default function(store) {
  const routes = getRoutes(store);
  const component = (
    <Router render={(props) => <ReduxAsyncConnect {...props} />} history={browserHistory}>
      {routes}
    </Router>
  );

  return Promise.resolve({ component });
}
