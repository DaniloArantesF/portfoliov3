import { useCallback, useEffect } from 'react';
import { useStore } from '../lib/store';
import useTiles from '../lib/tileManager';
import { track2 } from '../config';

/**
 * Contains all game logic related to the game state
 */
export const useGameStateManager = () => {
  const { status, run, set } = useStore();
  const { setTiles } = useTiles();
  const startGame = () => set({ status: 'running' });
  const pauseGame = () => set({ status: 'paused' });
  const endGame = () => set({ status: 'ended' });
  const reset = () => {
    set((state) => ({
      status: 'running',
      score: 0,
      run: state.run + 1,
      curTrack: track2,
    }));
    setTiles([]);
  };

  // Show and hide game menu
  const handleMenuToggle = useCallback(() => {
    if (status === 'running') {
      pauseGame();
    } else if (status === 'paused' || status === 'idle') {
      startGame();
    }
  }, [status]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleMenuToggle();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [handleMenuToggle]);

  // -----------------

  return {
    status,
    startGame,
    pauseGame,
    endGame,
    reset,
    run,
  };
};
