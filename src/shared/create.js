import createLogger from 'redux-logger';
import { syncHistory } from 'redux-simple-router';
import { createStore as _createStore, applyMiddleware, compose } from 'redux';
// import path from 'path';

export default function createStore(customMiddleware, history, reducers, data) {
  const router = syncHistory(history);
  const defaultMiddleware = [ router ];
  const middleware = customMiddleware.concat(defaultMiddleware);

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

  const store = finalCreateStore(reducers, data);

  // only necessary for devtools https://github.com/rackt/redux-simple-router/pull/141#issuecomment-167587581
  router.syncHistoryToStore(store);

  // if (__DEVELOPMENT__ && module.hot) {
  //   module.hot.accept(__REDUCER_INDEX__, () => {
  //   module.hot.accept('../../../../src/redux/modules/index', () => {
  //     store.replaceReducer(require(path.resolve(__REDUCER_INDEX__)));
  //     store.replaceReducer(require('../../../../src/redux/modules/index'));
  //   });
  // }

  return store;
}
