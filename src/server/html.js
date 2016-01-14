import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from '../containers/HtmlShell/HtmlShell';

export default (config, assets, store, headers, component) => {
  let CustomHtml;
  if (config.htmlShell) {
    CustomHtml = require(path.resolve(config.htmlShell)).default;
  } else {
    CustomHtml = Html;
  }

  return '<!doctype html>\n' + ReactDOM.renderToString(
    <CustomHtml assets={assets} store={store} component={component} headers={headers} />
  );
};
