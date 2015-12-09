import logger from 'redux-logger';
import path from 'path';
import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import configResolver from '../helpers/configResolver';

export default function createStore(customMiddleware, reducers, data) {
  const defaultMiddleware = [];
  const middleware = defaultMiddleware.concat(customMiddleware);

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

  const store = finalCreateStore(reducers, data);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept(path.resolve(configResolver().redux.reducers), () => {
      store.replaceReducer(path.resolve(configResolver().redux.reducers));
    });
  }

  return store;
}
