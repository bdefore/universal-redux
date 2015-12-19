const AUTHENTICATED_REQUEST = 'AUTHENTICATED_REQUEST';
const AUTHENTICATED_REQUEST_SUCCESS = 'AUTHENTICATED_REQUEST_SUCCESS';
const AUTHENTICATED_REQUEST_FAILURE = 'AUTHENTICATED_REQUEST_FAILURE';

const initialState = {
  message: undefined
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case AUTHENTICATED_REQUEST:
      return {
        state
      };
    case AUTHENTICATED_REQUEST_FAILURE:
      return {
        ...state,
        message: JSON.parse(action.error).message
      };
    case AUTHENTICATED_REQUEST_SUCCESS:
      return {
        ...state,
        message: JSON.parse(action.result).message
      };
    default:
      return state;
  }
}

export function makeAuthenticatedRequest() {
  return {
    types: [AUTHENTICATED_REQUEST, AUTHENTICATED_REQUEST_SUCCESS, AUTHENTICATED_REQUEST_FAILURE],
    promise: (client) => client.get('/authenticated_request')
  };
}
