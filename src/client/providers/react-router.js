import React from 'react';
import { Router } from 'react-router';
import { browserHistory } from 'react-router';
import { ReduxAsyncConnect } from 'fmp-redux-async-connect';
import getRoutes from 'universal-redux/routes';

export default function(store) {
  const component = (
    <Router render={(props) => <ReduxAsyncConnect {...props} />} history={browserHistory}>
      {getRoutes(store)}
    </Router>
  );

  return component;
}
