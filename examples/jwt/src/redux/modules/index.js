import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import auth from './auth';
import api from './api';

export default combineReducers({
  auth: auth,
  api: api,
  router: routerStateReducer
});
