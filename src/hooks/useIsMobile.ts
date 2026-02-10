'use client';

import { useState, useEffect } from 'react';
import { touchState } from '@/lib/touchState';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(mobile);
    touchState.isMobile = mobile;
  }, []);

  return isMobile;
}
