// Lightweight Mobile Haptic Feedback Utility (Web Vibration API)
// Provides subtle tactical tactile feedback on supported touch devices

export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' = 'light') {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.vibrate) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(12); // Subtle tap feedback (12ms)
        break;
      case 'medium':
        navigator.vibrate(25); // Definite collision/flap feedback (25ms)
        break;
      case 'success':
        navigator.vibrate([20, 40, 30]); // Combo/milestone pulse
        break;
      case 'warning':
        navigator.vibrate([40, 50, 40]); // Crash / game over pulse
        break;
    }
  } catch {
    // Gracefully ignore if browser suppresses vibration
  }
}
