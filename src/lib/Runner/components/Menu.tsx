import { useMemo, useState, useCallback, useLayoutEffect } from 'react';
import classes from '@lib/Runner/styles/Menu.module.css';
import Overlay from './Overlay';
import { useStore } from '../lib/store';

interface MenuButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

interface MenuViewProps {
  children?: React.ReactNode;
  view: string;
  setView: (view: string) => void;
}

function MenuButton({ children, onClick }: MenuButtonProps) {
  return (
    <button className={classes.item} onClick={onClick}>
      {children}
    </button>
  );
}

function MenuRoot({ setView }: MenuViewProps) {
  const { status, startGame } = useStore();

  const menuOptions = useMemo(
    () => [
      { label: 'Resume', onClick: () => startGame() },
      { label: 'Options', onClick: () => setView('options') },
    ],
    [],
  );

  return (
    <>
      <h3 className={classes.title}>Menu</h3>
      {menuOptions.map(({ label, onClick }) => (
        <MenuButton key={label} onClick={onClick}>
          {label}
        </MenuButton>
      ))}
    </>
  );
}

function MenuOptions({ setView }: MenuViewProps) {
  return (
    <>
      <h3 className={classes.title}>Options</h3>
      <MenuButton onClick={() => setView('')}>Back</MenuButton>
    </>
  );
}

function Menu() {
  const { status, startGame, pauseGame } = useStore();
  const [view, setView] = useState('');
  const viewProps = useMemo(() => ({ view, setView }), [view, setView]);
  const handleClickAway = useCallback<React.MouseEventHandler>((event) => {
    startGame();
  }, []);

  // Show and hide game menu
  const handleMenuToggle = useCallback(() => {
    if (status === 'running') {
      pauseGame();
    } else if (status === 'paused' || status === 'idle') {
      startGame();
    }
  }, [status]);

  useLayoutEffect(() => {
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
  return status === 'paused' ? (
    <div className={classes.container}>
      <div className={classes.body}>
        {view === '' && <MenuRoot {...viewProps} />}
        {view === 'options' && <MenuOptions {...viewProps} />}
      </div>
      <Overlay onClick={handleClickAway} />
    </div>
  ) : null;
}

export default Menu;
