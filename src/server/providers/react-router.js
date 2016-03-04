import { match as reactRouterMatch } from 'react-router';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import { syncHistoryWithStore } from 'react-router-redux';

export function match(routes, location, store, cb) {
  const history = syncHistoryWithStore(createMemoryHistory(), store);
  reactRouterMatch({ history, routes, location }, cb);
}
