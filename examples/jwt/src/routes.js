import React from 'react';
import {Route} from 'react-router';
import App from './containers/App/App';

export default () => {
  return (
    <Route path="/" component={App} />
  );
};
