import { match as reactRouterMatch } from 'react-router';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';

export function match(routes, location, store, cb) {
  reactRouterMatch({ history: createMemoryHistory(), routes, location }, cb);
}
