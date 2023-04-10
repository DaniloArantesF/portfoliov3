import { useLayoutEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import classes from '../styles/ui.module.css';

function Score() {
  const ref = useRef<HTMLSpanElement>(null);
  const score = useRef(useStore.getState().score);

  useLayoutEffect(() => {
    useStore.subscribe((state) => {
      if (ref.current) {
        score.current = state.score;
        ref.current.innerText = `${score.current}`;
      }
    });
  }, []);

  return (
    <div className={classes.score}>
      <span ref={ref}>{score.current}</span>
    </div>
  );
}

export default Score;
