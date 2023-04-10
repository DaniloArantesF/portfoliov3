import { forwardRef } from 'react';
import classes from '../styles/Menu.module.css';

type OverlayProps = React.HTMLProps<HTMLDivElement>;

const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  (props: OverlayProps, ref) => {
    return <div ref={ref} className={classes.overlay} {...props} />;
  },
);

export default Overlay;
