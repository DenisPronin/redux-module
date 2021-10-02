import { Dispatch } from "redux";
import ReduxModule from "./abstract/ReduxModule";

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
      }
    };
  }
  
  defineActions () {
    const incrementAsync = (value: number) => (dispatch: Dispatch) => {
      setTimeout(() => {
        dispatch(this.actions.incrementByAmount(value));
      }, 1000);
    };
    
    const setPathValue = this.setIn('setPathValue', 'data.value.val');
    const setVarPathValue = this.setIn('setVarPathValue', 'data.{valueField}.{field}');
    const mergeDataValue = this.mergeIn('mergeDataValue', 'data.value');
    
    return {
      incrementAsync,
      setPathValue,
      setVarPathValue,
      mergeDataValue
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
  mergeDataValue
} = counter.actions;

export default counter;
