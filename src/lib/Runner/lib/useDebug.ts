import { useRef, useEffect } from 'react';

export default function useDebug(debugMode = false) {
  const didIRun = useRef<boolean>(false);

  useEffect(() => {
    if (didIRun.current === false) {
      didIRun.current = true;
    }
    if (debugMode === true) {
       
      console.info(
        `%c   mount :) ${new Date().toUTCString()} ${performance
          .now()
          .toFixed(3)}`,
        'background: #222; color: #44ff77',
      );
    }
    return () => {
      if (debugMode === true) {
         
        console.info(
          `%c unmount :( ${new Date().toUTCString()} ${performance
            .now()
            .toFixed(3)}`,
          'background: #222; color: #ff4477',
        );
      }
    };
  });
}
