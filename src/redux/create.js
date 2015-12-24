import createLogger from 'redux-logger';
// import path from 'path';
import { routeReducer } from 'redux-simple-router';

import { createStore as _createStore, applyMiddleware, combineReducers, compose } from 'redux';

export default function createStore(customMiddleware, reducers, data) {
  const defaultMiddleware = [];
  const middleware = defaultMiddleware.concat(customMiddleware);

  if (__CLIENT__ && __LOGGER__) {
    middleware.push(createLogger({ collapsed: true }));
  }

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools').default;
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const reducer = combineReducers(Object.assign({}, reducers, { routing: routeReducer } ));

  const store = finalCreateStore(reducer, data);

  // if (__DEVELOPMENT__ && module.hot) {
  //   module.hot.accept(__REDUCER_INDEX__, () => {
  //   module.hot.accept('../../../../src/redux/modules/index', () => {
  //     store.replaceReducer(require(path.resolve(__REDUCER_INDEX__)));
  //     store.replaceReducer(require('../../../../src/redux/modules/index'));
  //   });
  // }

  return store;
}
