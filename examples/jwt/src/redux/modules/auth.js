const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

const initialState = {
  loggingIn: false,
  loggedIn: undefined,
  loginFailed: false,
  message: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loggedIn: false,
        loggingIn: true,
        loginFailed: false,
        message: null
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loggedIn: false,
        loggingIn: false,
        loginFailed: true,
        message: 'Failed to log in. Is your email/password combination correct?'
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        loggingIn: false,
        loginFailed: false,
        message: 'Successfully logged in. Token stored in session store.'
      };
    case LOGOUT:
      return {
        loggingIn: false,
        loggedIn: false,
        loginFailed: false,
        message: null
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggedIn: false,
        loggingIn: false,
        loginFailed: false,
        message: 'Succesfully logged out. Token removed from session store.'
      };
    case LOGOUT_FAILURE:
      return {
        ...state
      };
    default:
      return state;
  }
}

export function login(email, password) {
  const data = { user: { email: email, password: password }};
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE],
    promise: (client) => client.post('/login', { data: data })
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILURE],
    promise: (client) => client.post('/logout')
  };
}
