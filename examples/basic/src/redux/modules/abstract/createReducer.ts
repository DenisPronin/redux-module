export const reduceReducers = (reducers: any, initialState: any) => {
  return (prevState: any, value: any, ...args: any) => {
    const prevStateIsUndefined = typeof prevState === 'undefined';
    const valueIsUndefined = typeof value === 'undefined';
    
    if (prevStateIsUndefined && valueIsUndefined && initialState) {
      return initialState;
    }
    
    return reducers.reduce((newState: any, reducer: any, index: any) => {
      if (typeof reducer === 'undefined') {
        throw new TypeError(
          `An undefined reducer was passed in at index ${index}`
        );
      }
      
      return reducer(newState, value, ...args);
    }, prevStateIsUndefined && !valueIsUndefined && initialState ? initialState : prevState);
  };
};
