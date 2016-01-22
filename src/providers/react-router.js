import React from 'react';
import { Router, match as reactRouterMatch } from 'react-router';
import { browserHistory } from 'react-router';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';

export function createForClient(store) {

  // HERE LIES THE PROBLEM
  // resolves via webpack aliases as assigned in merge-configs.js
  import getRoutes from 'routes';

  const routes = getRoutes(store);
  const component = (
    <Router history={this.history()}>
      {routes}
    </Router>
  );

  return Promise.resolve({ component });
}

export function createForServer(store) {
  const path = require('path');
  const getRoutes = require(path.resolve(config.routes)).default;
  const component = (
    <Router render={(props) => <ReduxAsyncConnect {...props} />} history={history}>
      {getRoutes(store)}
    </Router>
  );

  return Promise.resolve({ component });
}

export function history() {
  return __CLIENT__ ? browserHistory : createMemoryHistory();
}

export function match(config, location, store, cb) {
  const path = require('path');
  const getRoutes = require(path.resolve(config.routes)).default;
  reactRouterMatch({ history: this.history(), routes: getRoutes(store), location }, cb);
}
