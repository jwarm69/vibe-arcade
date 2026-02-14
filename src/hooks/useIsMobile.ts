'use client';

import { useEffect, useMemo } from 'react';
import { touchState } from '@/lib/touchState';

function detectMobile() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function useIsMobile() {
  const isMobile = useMemo(() => detectMobile(), []);

  useEffect(() => {
    touchState.isMobile = isMobile;
  }, [isMobile]);

  return isMobile;
}
