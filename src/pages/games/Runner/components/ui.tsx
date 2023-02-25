import classes from '../styles/ui.module.css';

interface UIProps {
  children: React.ReactNode;
}

function UI({ children }: UIProps) {
  return <div className={classes.container}>{children}</div>;
}

export default UI;
