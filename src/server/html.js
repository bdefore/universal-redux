import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import DefaultHtml from '../containers/HtmlShell/HtmlShell';

export default (htmlShell, assets, store, headers, component) => {
  const Html = htmlShell ? require(path.resolve(htmlShell)).default : DefaultHtml;

  return '<!doctype html>\n' + ReactDOM.renderToString(
    <Html assets={assets} store={store} component={component} headers={headers} />
  );
};
