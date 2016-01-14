import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { compose as _compose, applyMiddleware } from 'redux';
import { createDevTools, persistState } from 'redux-devtools';

import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor />
  </DockMonitor>
);

export const InvisibleDevTools = createDevTools(
  <DockMonitor defaultIsVisible={false} toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor />
  </DockMonitor>
);

export function compose(middleware) {
  const Tools = __DEVTOOLS_IS_VISIBLE__ ? DevTools : InvisibleDevTools;
  return _compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : Tools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  );
}

export function render(component, store, dest) {
  if (__DEVTOOLS__ && !window.devToolsExtension) {
    const Tools = __DEVTOOLS_IS_VISIBLE__ ? DevTools : InvisibleDevTools;
    ReactDOM.render(
      <Provider store={store} key="provider">
        <div>
          {component}
          <Tools />
        </div>
      </Provider>,
      dest
    );
  }
}
