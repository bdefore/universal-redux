import createLogger from 'redux-logger';
import { syncHistory } from 'redux-simple-router';
import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import reducers from '../../../../src/redux/modules';

function hmr(store) {
  // Attempt to assign to module.hot.accept in routes
  // since that is relative to the files we care about
  // Alternatively we could assign to universal-redux
  // create.js around line 32 but that behaves the same.

  // Verify HMR is available
  // console.log('module.hot', module.hot);

  if (module.hot) {
    // Verify HMR is active
    // console.log('module.hot is active', module.hot.active);

    // Verify that universal-redux npm module is passing store
    // See universal-redux client.js line 18
    // See universal-redux renderer.js line 53
    // console.log('has store?', store);

    module.hot.accept('../../../../src/redux/modules', () => {
      // But the accept handler never fires!
      // console.log('in accept handler updating', updatedDependencies);

      const nextRootReducer = require('../../../../src/redux/modules/index').default;

      // Log out next root reducer
      // console.log('root reducer', nextRootReducer);

      store.replaceReducer(nextRootReducer);
    });
  }
}

export default function createStore(customMiddleware, history, data) {
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

  hmr(store);

  return store;
}
