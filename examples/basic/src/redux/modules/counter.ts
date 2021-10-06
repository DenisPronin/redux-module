import { Dispatch } from "redux";
import ReduxModule, { IShortAction } from "./abstract/ReduxModule";
import githubApi from "../../api/githubApi";

interface CounterState {
  value: number;
}

class Counter extends ReduxModule {

  getInitialState () {
    return {
      value: 0,
      data: {
        flag: false,
        value: {
          val: 0,
          varVal: 0
        }
      },
      user: {
        isPending: false,
        data: null,
        error: ''
      }
    };
  }
  
  defineActions () {
    const incrementAsync = (value: number) => (dispatch: Dispatch) => {
      setTimeout(() => {
        dispatch(this.actions.incrementByAmount(value));
      }, 1000);
    };
    
    const reset = this.resetToInitialState('reset');
    
    const getUser = this.thunkAction({
      actionName: 'getUser',
      actionMethod: githubApi.getUser,
      pendingPath: 'user.isPending',
      fulfilledMethod: 'setIn',
      fulfilledPath: 'user.data',
      normalize: (response) => response.data
    });
    
    return {
      incrementAsync,
      setPathValue: { method: 'setIn', path: 'data.value.val' } as IShortAction,
      setVarPathValue: { method: 'setIn', path: 'data.{valueField}.{field}' } as IShortAction,
      mergeDataValue: { method: 'mergeIn', path: 'data.{valueField}' } as IShortAction,
      toggleFlag: { method: 'toggleIn', path: 'data.flag' } as IShortAction,
      reset,
      getUser
    };
  }
  
  defineReducers () {
    return {
      increment: (state: CounterState) => {
        return {
          ...state,
          value: state.value + 1
        };
      },
  
      incrementByAmount: (state: CounterState, action: any) => {
        return {
          ...state,
          value: state.value + action.payload
        };
      },
  
      decrement: (state: CounterState) => {
        return {
          ...state,
          value: state.value - 1
        };
      }
    };
  }
}

const counter = new Counter();
counter.init();

export const {
  increment,
  incrementByAmount,
  decrement,
  incrementAsync,
  setPathValue,
  setVarPathValue,
  mergeDataValue,
  toggleFlag,
  reset,
  getUser
} = counter.actions;

export default counter;
