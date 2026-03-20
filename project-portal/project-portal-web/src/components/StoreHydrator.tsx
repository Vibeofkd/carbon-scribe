'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store/store';

export default function StoreHydrator() {
  const isHydrated = useStore((s) => s.isHydrated);
  const setHydrated = useStore((s) => s.setHydrated);

  useEffect(() => {
    if (!isHydrated) {
      setHydrated(true);
    }
  }, [isHydrated, setHydrated]);

  return null;
}
