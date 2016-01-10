import createLogger from 'redux-logger';
import { syncHistory } from 'redux-simple-router';
import { createStore as _createStore, applyMiddleware, compose } from 'redux';

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
  //   console.log('assigning module.hot.accept');
  //   module.hot.accept('../../../../src/redux/modules', (updatedDependencies) => {
  //   // module.hot.accept('redux/modules', (updatedDependencies) => {
  //     console.log('accept', updatedDependencies);
  //     const nextRootReducer = require('../../../../src/redux/modules/index').default;
  //     store.replaceReducer(nextRootReducer);
  //   });
  // }

  return store;
}
