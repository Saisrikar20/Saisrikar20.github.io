'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double tracking on identical path re-renders
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    // Do not track admin or keystatic routes
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/keystatic')) {
      return;
    }

    try {
      const payload = JSON.stringify({
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      });

      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', payload);
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Fail silently to never degrade user experience
    }
  }, [pathname]);

  return null;
}
