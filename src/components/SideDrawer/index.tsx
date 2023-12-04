import { useState } from 'react';
import classes from './SideDrawer.module.scss';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  isOpen: boolean;
  label?: string;
  side?: 'left' | 'right';
  top?: number;
  bottom?: number;
  onClose?: () => void;
  onOpen?: () => void;
};

const SideDrawer: React.FC<Props> = ({
  isOpen,
  children,
  side = 'left',
  label,
  onOpen,
  onClose,
}) => {
  const [open, setOpen] = useState(isOpen);

  const toggleDrawer = () => {
    setOpen((o) => !o);
    if (isOpen) {
      onClose && onClose();
    } else {
      onOpen && onOpen();
    }
  };

  return (
    <>
      <div
        className={`${classes.container} ${classes[side]} ${
          open ? classes.open : ''
        }`}
      >
        <button className={`${classes.button}`} onClick={toggleDrawer}>
          {label && <span className={classes.label}>{label}</span>}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.icon}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.64001 11.8236L6.34712 12.5307L9.99357 8.88422L13.64 12.5307L14.3471 11.8236L9.99357 7.47001L5.64001 11.8236Z"
              fill="currentColor"
            />
          </svg>
        </button>
        {children}
      </div>
    </>
  );
};

export default SideDrawer;
