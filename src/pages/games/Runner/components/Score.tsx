import { useStore } from '../lib/store';
import classes from '../styles/ui.module.css';

function Score() {
  const { score } = useStore();

  return (
    <div className={classes.score}>
      <span>{score}</span>
    </div>
  );
}

export default Score;
