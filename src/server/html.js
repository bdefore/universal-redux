import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { StyleSheetServer } from 'aphrodite';
import Head from './head';
import Body from './body';

export default (config, assets, store, headers, component) => {
  const root = config.html.root || config.htmlShell;
  if (root) {
    const Html = require(path.resolve(root)).default;
    const { html } = StyleSheetServer.renderStatic(() => ReactDOM.renderToString(
      <Html assets={assets} store={store} component={component} headers={headers}/>));
    return '<!doctype html>\n' + html;
  }

  const { html } = StyleSheetServer.renderStatic(() => ReactDOM.renderToString(
    <html lang="en-us">
      <Head additions={config.html.head} assets={assets} store={store} headers={headers} />
      <Body assets={assets} store={store} headers={headers} component={component} />
    </html>
  ));
  return '<!doctype html>\n'  + html;
};
