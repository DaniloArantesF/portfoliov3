import gsap from 'gsap';
import { useMemo } from 'react';

export function useGsapContext(scope?: string | object | Element) {
  const ctx = useMemo(
    () => (gsap.context ? gsap.context(() => {}, scope) : null),
    [scope],
  );
  return ctx;
}
