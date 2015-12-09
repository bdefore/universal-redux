function fetchAllData(components, getState, dispatch, location, params, deferred) {
  const methodName = deferred ? 'fetchDataDeferred' : 'fetchData';
  return components
    .filter((component) => !!component) // Weed out 'undefined' routes
    .filter((component) => component[methodName]) // only look at ones with a static fetchData()
    .map((component) => component[methodName])    // pull out fetch data methods
    .map(fetchData => fetchData(getState, dispatch, location, params));  // call fetch data methods and save promises
}

export default (components, getState, dispatch, location, params) => {
  return new Promise(resolve => {
    const doTransition = () => {
      Promise.all(fetchAllData(components, getState, dispatch, location, params, true))
        .then(resolve)
        .catch(error => {
          // TODO: You may want to handle errors for fetchDataDeferred here
          console.warn('Warning: Error in fetchDataDeferred', error);
          return reject(error);
        });
    };

    return Promise.all(fetchAllData(components, getState, dispatch, location, params))
      .then(doTransition)
      .catch(error => {
        // TODO: You may want to handle errors for fetchData here
        console.warn('Warning: Error in fetchData', error);
        return doTransition();
      });
  });
};
