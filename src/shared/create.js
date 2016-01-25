import { syncHistory, routeReducer } from 'redux-simple-router';
import { applyMiddleware, createStore as reduxCreateStore, combineReducers } from 'redux';

import { hooks, execute } from '../hooks';

// explicit path required for HMR to function. see #7
import staticReducers from '../../../../src/redux/modules';

function hmr(store) {
  if (module.hot) {
    module.hot.accept('../../../../src/redux/modules', () => {
      const nextRootReducer = require('../../../../src/redux/modules/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }
}

function createMiddlewareHook({ middleware }) {
  return applyMiddleware(...middleware);
}

function createReducerHook({ reducers }) {
  return combineReducers(reducers);
}

function createStoreHook({ createStore, reducer, data }) {
  return createStore(reducer, data);
}

export default function create(staticMiddleware, history, data) {
  const router = syncHistory(history);
  const middleware = staticMiddleware.concat([ router ]);
  const reducers = { ...staticReducers, routing: routeReducer };

  const store = execute(hooks.CREATE_REDUX_STORE, {
    reducer: execute(hooks.CREATE_REDUX_REDUCER, { reducers }, createReducerHook),
    createStore: execute(hooks.CREATE_REDUX_MIDDLEWARE, { middleware }, createMiddlewareHook)(reduxCreateStore),
    router,
    data
  }, createStoreHook);

  hmr(store);
  return store;
}
