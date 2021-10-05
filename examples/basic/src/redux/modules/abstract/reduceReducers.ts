import { CombinedState, Reducer } from "redux";

export const reduceReducers = (reducers: Reducer[], initialState: CombinedState<any>) => {
  return (prevState: CombinedState<any>, value: any, ...args: any) => {
    const prevStateIsUndefined = typeof prevState === 'undefined';
    const valueIsUndefined = typeof value === 'undefined';
    
    if (prevStateIsUndefined && valueIsUndefined && initialState) {
      return initialState;
    }
    
    return reducers.reduce((newState: CombinedState<any>, reducer: any, index: number) => {
      if (typeof reducer === 'undefined') {
        throw new TypeError(
          `An undefined reducer was passed in at index ${index}`
        );
      }
      
      return reducer(newState, value, ...args);
    }, prevStateIsUndefined && !valueIsUndefined && initialState ? initialState : prevState);
  };
};
