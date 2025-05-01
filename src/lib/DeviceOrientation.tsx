import { useEffect } from 'react';
import { create } from 'zustand';

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

export const PermissionsPrompt = () => {
  const { permission, setPermission } = useDeviceOrientation();

  // Check if running on iOS
  useEffect(() => {
    const requestPermission = (
      DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
    ).requestPermission;
    const iOS = typeof requestPermission === 'function';
    if (iOS) {
      setPermission(-1);
    }
  }, []);

  async function requestPermissions() {
    const requestPermission = (
      DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
    ).requestPermission;
    if (requestPermission) {
      const response = await requestPermission();
      setPermission(response === 'granted' ? 1 : -1);
    } else {
      alert('DeviceMotionEvent is not defined');
    }
  }
  return permission === -1 ? (
    <button className={'permissions_btn'} onClick={requestPermissions}>
      Permission
    </button>
  ) : null;
};
