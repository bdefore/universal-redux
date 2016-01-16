import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';

export default class Body extends Component {
  static propTypes = {
    additions: PropTypes.string,
    assets: PropTypes.object,
    asyncProps: PropTypes.object,
    component: PropTypes.node,
    headers: PropTypes.object,
    store: PropTypes.object,
  };

  render() {
    const {assets, component, store, asyncProps} = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';

    return (
      <body>
        <div id="content" dangerouslySetInnerHTML={{__html: content}}/>
        {asyncProps && <script dangerouslySetInnerHTML={{__html: `window.__ASYNC_PROPS__=${serialize(asyncProps.propsArray)};`}}
                charSet="UTF-8"/>}
        <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} charSet="UTF-8"/>
        {Object.keys(assets.javascript).map((jsAsset, key) =>
          <script src={assets.javascript[jsAsset]} key={key} charSet="UTF-8"/>
        )}
      </body>
    );
  }
}
