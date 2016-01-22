import React from 'react';
import ReactDOM from 'react-dom';

import createStore from './shared/create';
import { render as renderDevtools } from './client/devtools';

// dependencies of external source. these resolve via webpack aliases
// as assigned in merge-configs.js
import middleware from 'middleware';
import { createForClient as createRootComponentForClient } from 'rootComponent';

const dest = document.getElementById('content');

const store = createStore(middleware, window.__data);
const devComponent = renderDevtools();

// There is probably no need to be asynchronous here
createRootComponentForClient(store, __PROVIDERS__)
  .then(({ root }) => {
    ReactDOM.render(root, dest);

    if (process.env.NODE_ENV !== 'production') {
      window.React = React; // enable debugger
      if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
        console.warn('WARNING: Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
      }
    }

    return devComponent ? createRootComponentForClient(store, { devComponent }, __PROVIDERS__) : {};
  })
  .then(({ root }) => {
    if (root) ReactDOM.render(root, dest);
  })
  .catch((err) => {
    console.error(err, err.stack);
  });
