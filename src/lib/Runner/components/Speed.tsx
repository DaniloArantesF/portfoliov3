import { useLayoutEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import classes from '../styles/ui.module.css';

function Speed() {
  const scrollingSpeed = useRef(useStore.getState().scrollingSpeed);
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    useStore.subscribe(() => {
      scrollingSpeed.current = useStore.getState().scrollingSpeed;
      if (ref.current) {
        ref.current.innerText = `Speed: ${scrollingSpeed.current.toFixed(2)}`;
      }
    });
  }, []);

  return (
    <div className={classes.speed}>
      <span ref={ref}>Speed: {scrollingSpeed.current.toFixed(2)}</span>
    </div>
  );
}

export default Speed;
