import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import { StyleSheetServer } from 'aphrodite';
import serialize from 'serialize-javascript';

export default class Body extends Component {
  static propTypes = {
    additions: PropTypes.string,
    assets: PropTypes.object,
    component: PropTypes.node,
    headers: PropTypes.object,
    store: PropTypes.object,
  };

  render() {
    const { assets, component, store } = this.props;
    let content = '';
    if (component) {
      const { html } = StyleSheetServer.renderStatic(() => ReactDOM.renderToString(component));
      content = html;
    }
    return (
      <body>
        <div id="content" dangerouslySetInnerHTML={{ __html: content }}/>
        <script dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }} charSet="UTF-8"/>
        { Object.keys(assets.javascript).map((jsAsset, key) =>
          <script src={assets.javascript[jsAsset]} key={key} charSet="UTF-8"/>
        )}
      </body>
    );
  }
}
