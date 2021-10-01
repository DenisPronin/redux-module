import ReduxModule from "./abstract/ReduxModule";

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
    return {};
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

export const {increment, incrementByAmount, decrement} = counter.actions;

export default counter;
