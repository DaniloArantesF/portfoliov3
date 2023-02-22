import { useEffect, useMemo, useState, useCallback } from 'react';
import { useGameStateManager } from '../hooks/gameStateManager';
import { useStore } from '../lib/store';
import classes from '../styles/Menu.module.css';
import Overlay from './Overlay';

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
  const { status, startGame } = useGameStateManager();

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
  const { status, startGame } = useGameStateManager();
  const [view, setView] = useState('');
  const viewProps = useMemo(() => ({ view, setView }), [view, setView]);
  const handleClickAway = useCallback<React.MouseEventHandler>((event) => {
    startGame();
  }, []);

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
