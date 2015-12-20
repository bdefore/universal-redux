import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import auth from './auth';
import api from './api';

export default combineReducers({
  auth: auth,
  api: api,
  routing: routeReducer
});
