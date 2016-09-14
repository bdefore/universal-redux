import path from 'path';
import React, { Component, PropTypes } from 'react';

export default class Head extends Component {
  static propTypes = {
    additions: PropTypes.string,
    assets: PropTypes.object,
    headers: PropTypes.object,
    store: PropTypes.object
  };

  renderAdditions() {
    const { additions, headers, store } = this.props;
    if (additions) {
      const additionsNode = require(path.resolve(additions)).default;
      return additionsNode(store, headers);
    }

    return null;
  }

  render() {
    const { assets } = this.props;

    return (
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* styles (will be present only in production with webpack extract text plugin) */}
        {Object.keys(assets.styles).map((style, key) =>
          <link
            href={assets.styles[style]}
            key={key}
            media="screen, projection"
            rel="stylesheet"
            type="text/css"
            charSet="UTF-8"
          />
        )}
        {this.renderAdditions()}
      </head>
    );
  }
}
