/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
// node modules dependencies
import React from 'react';
import { each } from 'lodash';
import ReactDOM from 'react-dom';
import createStore from './redux/create';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { fromJSON } from 'transit-immutable-js';

// TODO: get useScroll working again with react-router 2
// import useScroll from 'scroll-behavior/lib/useStandardScroll';
// const history = useScroll(browserHistory)();

// dependencies of external source. these resolve via webpack aliases
// as assigned in merge-configs.js
import getRoutes from 'routes';
import reducers from 'reducers';
import customMiddleware from 'middleware';

// assemble custom middleware
const middleware = [];
each(customMiddleware, (customMiddlewareToAdd) => {
  if (typeof customMiddlewareToAdd === 'function') {
    middleware.push(customMiddlewareToAdd());
  }
});

const dest = document.getElementById('content');
const data = fromJSON(window.__data);
const store = createStore(middleware, browserHistory, reducers, data);


const component = (
  <Router history={browserHistory}>
    {getRoutes()}
  </Router>
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
  const DevTools = require('./containers/DevTools/DevTools').default;
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
