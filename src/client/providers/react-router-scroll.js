import React from 'react';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { useScroll } from 'react-router-scroll';
import getRoutes from 'universal-redux/routes';

export default function(store, devComponent) {
  const root = (
    <Provider store={store} key="provider">
      <div>
        <Router render={applyRouterMiddleware(useScroll())} history={browserHistory}>
          {getRoutes(store)}
        </Router>
        {devComponent}
      </div>
    </Provider>
  );

  return Promise.resolve(root);
}
