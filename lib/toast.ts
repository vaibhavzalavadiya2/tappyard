export type ToastType = 'success' | 'diamond' | 'challenge' | 'info';

export interface ToastEventDetail {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export function showToast(
  message: string,
  type: ToastType = 'info',
  duration = 3200
) {
  if (typeof window === 'undefined') return;

  const detail: ToastEventDetail = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    message,
    type,
    duration,
  };

  window.dispatchEvent(new CustomEvent('tappyard-toast', { detail }));
}
