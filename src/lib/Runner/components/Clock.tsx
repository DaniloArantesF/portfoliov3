import { useLayoutEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import classes from '../styles/ui.module.css';

function Clock() {
  const status = useStore((state) => state.status);
  const time = useRef(0);
  const ref = useRef<HTMLSpanElement>(null);
  const interval = useRef<NodeJS.Timeout>(null);

  useLayoutEffect(() => {
    ref.current!.innerText = getTimeString();
  }, []);

  useLayoutEffect(() => {
    if (status === 'running') {
      interval.current = setInterval(() => updateClock(100), 100);
    } else {
      clearInterval(interval.current!);
      if (status === 'ended') {
        time.current = 0;
        ref.current!.innerText = getTimeString();
      }
    }
  }, [status]);

  function updateClock(delta: number) {
    if (status === 'running') {
      time.current += delta;
      ref.current!.innerText = getTimeString();
    }
  }

  function getTimeString() {
    const cent = Math.floor(time.current / 10) % 100;
    const seconds = Math.floor(time.current / 1000);
    const minutes = Math.floor(seconds / 60);
    return (
      `${minutes}`.padStart(2, '0') +
      ':' +
      `${seconds % 60}`.padStart(2, '0') +
      ':' +
      `${cent}`.padStart(2, '0')
    );
  }

  return (
    <div className={classes.clock}>
      <span ref={ref}></span>
    </div>
  );
}

export default Clock;
