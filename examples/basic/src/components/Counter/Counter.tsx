import React from 'react';
import styles from './Counter.module.css';
import { decrement, increment, incrementByAmount, incrementAsync, setPathValue } from "../../redux/modules/counter";
import { useAppDispatch, useAppSelector } from "../../redux/store";

export function Counter() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.counter.value);
  const value = useAppSelector(state => state.counter.data.value);
  
  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        
        <span className={styles.value}>{count}</span>
        
        <button
          className={styles.button}
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        
        <button
          className={styles.button}
          onClick={() => dispatch(incrementByAmount(2))}
        >
          +2
        </button>
        
        <button
          className={styles.button}
          onClick={() => dispatch(incrementAsync(2))}
        >
          async inc
        </button>
      </div>
  
      <span className={styles.value}>{value}</span>
      <button
        className={styles.button}
        onClick={() => dispatch(setPathValue(5))}
      >
        set value
      </button>
    </div>
  );
}
