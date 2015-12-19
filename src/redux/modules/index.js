const initialState = {
  foo: 'bar'
}

export default function reducer(state = initialState, action = {}) {
  console.log('oi');
  switch (action.type) {
   default:
      return state;
  }
}
