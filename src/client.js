/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
// node modules dependencies
import 'babel/polyfill';
import React from 'react';
import { each } from 'lodash';
import ReactDOM from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import {Provider} from 'react-redux';
import {reduxReactRouter, ReduxRouter} from 'redux-router';

// dependencies of external source. these resolve via webpack aliases
// as assigned in merge-configs.js
import getRoutes from 'routes';
import reducers from 'reducers';
import customMiddleware from 'middleware';

// dependencies of serverside render
import createStore from './redux/create';
import makeRouteHooksSafe from './helpers/makeRouteHooksSafe';

// Three different types of scroll behavior available.
// Documented here: https://github.com/rackt/scroll-behavior
const scrollablehistory = useScroll(createHistory);

const dest = document.getElementById('content');

// assemble custom middleware, pass req, res
const middleware = [];
each(customMiddleware, (customMiddlewareToAdd) => {
  if (typeof customMiddlewareToAdd === 'function') {
    middleware.push(customMiddlewareToAdd());
  }
});

const store = createStore(reduxReactRouter, makeRouteHooksSafe(getRoutes), scrollablehistory, middleware, reducers, window.__data);

const component = (
  <ReduxRouter routes={getRoutes(store)} />
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools/DevTools');
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
