import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Head from './head';
import Body from './body';
import Helmet from 'react-helmet';

export default (config, assets, store, headers, component) => {
  const root = config.html.root || config.htmlShell;
  if (root) {
    const Html = require(path.resolve(root)).default;
    return '<!doctype html>\n' + ReactDOM.renderToString(
      <Html assets={assets} store={store} component={component} headers={headers} />
    );
  }

  const header = ReactDOM.renderToString(<Head additions={config.html.head} assets={assets} store={store} headers={headers} />);
  const body = ReactDOM.renderToString(<Body assets={assets} store={store} headers={headers} component={component} />);
  const head = Helmet.rewind();

  return `
    <!doctype html>
    <html ${head.htmlAttributes.toString()}>
        <head>
            ${header.replace('<head>', '').replace('</head>', '')}
            ${head.title.toString()}
            ${head.meta.toString()}
            ${head.link.toString()}
        </head>
        ${body}
    </html>
  `;
};
