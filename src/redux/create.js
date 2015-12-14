import logger from 'redux-logger';
// import path from 'path';
import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import routing from './middleware/routing';

export default function createStore(reduxReactRouter, getRoutes, createHistory, customMiddleware, reducers, data) {
  const defaultMiddleware = [routing];
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

  finalCreateStore = reduxReactRouter({ getRoutes, createHistory })(finalCreateStore);

  const store = finalCreateStore(reducers, data);

  // if (__DEVELOPMENT__ && module.hot) {
  //   module.hot.accept(__REDUCER_INDEX__, () => {
  //   module.hot.accept('../../../../src/redux/modules/index', () => {
  //     store.replaceReducer(require(path.resolve(__REDUCER_INDEX__)));
  //     store.replaceReducer(require('../../../../src/redux/modules/index'));
  //   });
  // }

  return store;
}
