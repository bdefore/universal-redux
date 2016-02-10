import { map } from 'lodash';
import createLogger from 'redux-logger';

// TODO: parameterize react-router
import { syncHistory } from 'react-router-redux';
import { browserHistory } from 'react-router';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';

import { compose as composeDevtools, listenToRouter as linkDevtoolsToRouter } from '../client/devtools';
import { applyMiddleware, createStore } from 'redux';

// explicit path required for HMR to function. see #7
import reducers from '../../../../src/redux/modules';

function hmr(store) {
  if (module.hot) {
    module.hot.accept('../../../../src/redux/modules', () => {
      const nextRootReducer = require('../../../../src/redux/modules/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }
}

export default function create(providedMiddleware, data) {
  // TODO: parameterize react-router
  let router;
  if (__CLIENT__) {
    router = syncHistory(browserHistory);
  } else {
    router = syncHistory(createMemoryHistory());
  }

  const defaultMiddleware = [ router ];

  // backward compatibility to 2.x api expecting object for middleware instead of array:
  const customMiddleware = !providedMiddleware.concat ? map(providedMiddleware, (m) => { return m; }) : providedMiddleware;

  const middleware = customMiddleware.concat(defaultMiddleware);

  if (__CLIENT__ && __LOGGER__) {
    middleware.push(createLogger({ collapsed: true }));
  }

  const useDevtools = __DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__;
  const finalCreateStore = useDevtools ? composeDevtools(middleware)(createStore) : applyMiddleware(...middleware)(createStore);

  const store = finalCreateStore(reducers, data);

  linkDevtoolsToRouter(router, store);

  hmr(store);

  return store;
}
