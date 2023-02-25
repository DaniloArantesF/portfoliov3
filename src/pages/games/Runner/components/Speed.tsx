import { useStore } from '../lib/store';
import classes from '../styles/ui.module.css';

function Speed() {
  const scrollingSpeed = useStore((state) => state.scrollingSpeed);
  return (
    <div className={classes.speed}>
      <span>Speed: {scrollingSpeed}</span>
    </div>
  );
}

export default Speed;
