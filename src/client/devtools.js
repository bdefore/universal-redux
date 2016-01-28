import React from 'react';
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

// context: https://github.com/rackt/react-router-redux/compare/1.0.2...2.0.2
// context: https://github.com/rackt/react-router-redux/pull/141#issuecomment-167587581
export function listenToRouter(routerMiddleware, store) {
  routerMiddleware.listenForReplays(store);
}

export function render() {
  if (__DEVTOOLS__ && !window.devToolsExtension) {
    const Tools = __DEVTOOLS_IS_VISIBLE__ ? DevTools : InvisibleDevTools;
    return <Tools />;
  }
}
