import React from 'react';
import styles from './Counter.module.css';
import { counterActions } from "../../redux/modules/counter";
import { useAppDispatch, useAppSelector } from "../../redux/store";

export function Counter() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.counter.value);
  const { decrement, increment } = counterActions;
  
  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
    </div>
  );
}
