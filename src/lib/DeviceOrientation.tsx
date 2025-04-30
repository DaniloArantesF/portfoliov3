import { useEffect, useMemo, useState } from 'react';
import { create } from 'zustand';
import { isMobile as checkIsMobile } from '~/utils/utils';
import styles from '../styles/button.module.css';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Smartphone, ComputerIcon } from 'lucide-react';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

interface DeviceOrientationState {
  alpha: number;
  beta: number;
  gamma: number;
  permission: -1 | 0 | 1; // -1 -> need permissions, not granted, 0 -> need to check, 1 -> granted
  setOrientation: (alpha: number, beta: number, gamma: number) => void;
  setPermission: (permission: -1 | 0 | 1) => void;
}

export const useDeviceOrientation = create<DeviceOrientationState>()((set) => ({
  alpha: 0,
  beta: 0,
  gamma: 0,
  permission: 0,
  setOrientation: (alpha, beta, gamma) =>
    set((state) => ({ alpha, beta, gamma })),
  setPermission: (permission) => set((state) => ({ permission })),
}));

const DeviceOrientationPermission: React.FC = () => {
  const { permission, setPermission } = useDeviceOrientation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hasDeviceOrientation = useMemo(
    () =>
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS)
        .requestPermission === 'function',
    [],
  );

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = checkIsMobile();
      setIsMobile(isMobileDevice);
    };

    checkMobile();
  }, []);

  useEffect(() => {
    const requestPermission = (
      DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
    ).requestPermission;

    const iOS = typeof requestPermission === 'function';

    if (iOS) {
      setPermission(-1);
    } else if (isMobile) {
      setPermission(1);
    } else {
      setPermission(-1);
    }
  }, [isMobile, setPermission]);

  const requestPermissions = async () => {
    const requestPermission = (
      DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
    ).requestPermission;

    if (requestPermission) {
      try {
        const response = await requestPermission();
        setPermission(response === 'granted' ? 1 : -1);
        setIsOpen(response !== 'granted');
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setPermission(-1);
      }
    } else if (!isMobile) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Smartphone className="w-5 h-5 mr-2" />
        <span className="font-medium">Enable 3D Controls</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-md w-full rounded-lg bg-surface-2 border border-surface-4 shadow-xl overflow-hidden"
            >
              <div className="h-1 w-full bg-gradient-to-r from-accent to-accent-2" />

              <div className="p-6">
                <div className="flex items-start mb-4">
                  {isMobile ? (
                    <Smartphone className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  ) : (
                    <ComputerIcon className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-text-main">
                      {isMobile
                        ? '3D Orientation Controls'
                        : 'This feature is not available on desktop'}
                    </h3>
                    <p className="mt-1 text-text-sub">
                      {isMobile
                        ? hasDeviceOrientation
                          ? 'Allow access to your device orientation to control the 3D model with your device movements.'
                          : 'Enable device orientation in your browser settings to control the 3D model with your device movements.'
                        : 'This feature requires a mobile device with orientation sensors. Please visit on your smartphone or tablet to use orientation controls.'}
                    </p>

                    {permission === -1 && isMobile && hasDeviceOrientation && (
                      <div className="mt-3 flex items-center p-3 rounded bg-surface-3 border border-surface-4">
                        <AlertCircle className="w-5 h-5 text-text-error mr-2 flex-shrink-0" />
                        <p className="text-sm text-text-sub">
                          Permission was denied. Please enable device
                          orientation in your browser settings and try again.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 rounded border border-surface-4 text-text-sub hover:bg-surface-3 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>

                  {isMobile && hasDeviceOrientation && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 rounded bg-gradient-to-r from-accent to-accent-2 text-white font-medium shadow-md"
                      onClick={requestPermissions}
                    >
                      Enable Orientation
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeviceOrientationPermission;
