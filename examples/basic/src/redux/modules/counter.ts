import ReduxModule from "./abstract/ReduxModule";

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

interface CounterState {
  value: number;
}

class Counter extends ReduxModule {
  getInitialState () {
    return {
      value: 0
    };
  }
  
  defineActions () {
    const increment = this.createAction(INCREMENT);
    const decrement = this.createAction(DECREMENT);
    
    return {
      increment,
      decrement
    };
  }
  
  defineReducers () {
    return {
      [INCREMENT]: (state: CounterState, action: any) => {
        return {
          ...state,
          value: state.value + action.payload
        };
      },
      
      [DECREMENT]: (state: CounterState) => {
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
export default counter;
