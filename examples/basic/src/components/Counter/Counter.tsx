import React from 'react';
import styles from './Counter.module.css';
import { decrement, increment, incrementByAmount } from "../../redux/modules/counter";
import { useAppDispatch, useAppSelector } from "../../redux/store";

export function Counter() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.counter.value);
  
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
      </div>
    </div>
  );
}
