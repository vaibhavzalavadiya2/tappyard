'use client';

import { useEffect } from 'react';
import { showToast } from '@/lib/toast';

export default function CloudSyncListener() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const authParam = params.get('auth');

    if (authParam === 'success' || authParam === 'error') {
      if (authParam === 'success') {
        showToast('Signed in! Syncing your diamonds & high scores...', 'diamond', 3500);
      } else {
        showToast('Sign-in did not complete. Please try again.', 'info', 4000);
      }

      params.delete('auth');
      const nextSearch = params.toString();
      const cleanUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', cleanUrl);
    }

    const hasExistingSessionHint =
      authParam === 'success' ||
      localStorage.getItem('tappyard_logged_in') === 'true' ||
      document.cookie.includes('sb-');

    const startAuth = () => {
      import('@/lib/cloudSync')
        .then(({ initCloudAuth }) => initCloudAuth())
        .catch(() => {
          // Ignore auth initialization issues on offline devices
        });
    };

    // Returning / OAuth-callback users initialize immediately; first-time guests defer until idle to preserve 0ms TBT.
    if (hasExistingSessionHint) {
      startAuth();
      return;
    }

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(startAuth, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timer = setTimeout(startAuth, 1500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
