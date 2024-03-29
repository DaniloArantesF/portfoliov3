import { useStore } from '../lib/store';
import classes from '../styles/Menu.module.css';

function GameOver() {
  const { status, resetTiles, resetState } = useStore();

  return status === 'ended' ? (
    <div className={classes.container}>
      <div>
        <h3 className={classes.title}>Game Over</h3>
      </div>
      <div
        className={classes.overlay}
        style={{ backgroundColor: 'rgba(100, 0, 0, 0.15)' }}
        onClick={() => {
          resetTiles();
          resetState();
        }}
      />
    </div>
  ) : null;
}

export default GameOver;
