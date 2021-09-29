const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

export const counterActions = {
  increment,
  decrement
}

/* tslint:disable-next-line */
export const counterReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case INCREMENT: {
      return {
        ...state,
         value: state.value + 1
      };
    }
    case DECREMENT: {
      return {
        ...state,
        value: state.value - 1
      };
    }
    default:
      return state;
  }
}

