import React from 'react';
import { Router, match as reactRouterMatch } from 'react-router';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';

export default function(store, routes) {
  const component = (
    <Router history={createMemoryHistory()}>
      {routes}
    </Router>
  );

  return Promise.resolve({ component });
}

export function match(routes, location, store, cb) {
  reactRouterMatch({ history: createMemoryHistory(), routes, location }, cb);
}
