export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});
      return promise(client).then(
        (response) => next({...rest, 'result': response.body, 'response': response, type: SUCCESS}),
        (error) => next({...rest, error, type: FAILURE})
      ).catch((error)=> {
        console.error('FETCHING MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE});
      });
    };
  };
}
