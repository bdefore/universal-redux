import logger from 'redux-logger';
import path from 'path';
import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import fetcher from './middleware/fetcher';
import routing from './middleware/routing';
import configResolver from '../helpers/configResolver';

export default function createStore(reduxReactRouter, getRoutes, createHistory, fetcherInstance, reducers, data) {
  const middleware = [fetcher(fetcherInstance), routing];

  if (__CLIENT__ && __LOGGER__) {
    middleware.push(logger);
  }

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  finalCreateStore = reduxReactRouter({ getRoutes, createHistory })(finalCreateStore);

  const store = finalCreateStore(reducers, data);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept(path.resolve(configResolver().reducers), () => {
      store.replaceReducer(path.resolve(configResolver().reducers));
    });
  }

  return store;
}
