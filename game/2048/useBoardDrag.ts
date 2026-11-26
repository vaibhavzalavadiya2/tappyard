'use client';

import {
  useRef,
  useEffect,
  useCallback,
  type DragEvent as ReactDragEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { Direction } from './logic';

interface DragOrigin {
  pointerId: number;
  x: number;
  y: number;
}

const RELEASE_THRESHOLD_PX = 18;
const LIVE_DRAG_THRESHOLD_PX = 34;

/**
 * Unified mouse-drag (PC) and touch-swipe gesture handler for 2048 boards.
 * Attaches global pointerup/pointercancel/blur fallbacks while a drag is active
 * so releasing the mouse outside the board or over another button never leaves
 * the drag state stuck.
 */
export function useBoardDrag(onMove: (direction: Direction) => void) {
  const dragOriginRef = useRef<DragOrigin | null>(null);
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const resolveDirection = useCallback((dx: number, dy: number): Direction => {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'down' : 'up';
  }, []);

  const finishDrag = useCallback(
    (pointerId: number, clientX: number, clientY: number, threshold: number) => {
      const origin = dragOriginRef.current;
      if (!origin || origin.pointerId !== pointerId) return;
      dragOriginRef.current = null;

      const dx = clientX - origin.x;
      const dy = clientY - origin.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;

      onMoveRef.current(resolveDirection(dx, dy));
    },
    [resolveDirection]
  );

  // Safety net: clear/finish active drags even if pointer releases outside the board element
  useEffect(() => {
    const handleWindowPointerUp = (e: PointerEvent) => {
      finishDrag(e.pointerId, e.clientX, e.clientY, RELEASE_THRESHOLD_PX);
    };
    const handleWindowCancel = () => {
      dragOriginRef.current = null;
    };

    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowCancel);
    window.addEventListener('blur', handleWindowCancel);
    return () => {
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowCancel);
      window.removeEventListener('blur', handleWindowCancel);
    };
  }, [finishDrag]);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragOriginRef.current = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Window pointerup listener acts as fallback when capture is unsupported
    }
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const origin = dragOriginRef.current;
      if (!origin || origin.pointerId !== e.pointerId) return;

      const dx = e.clientX - origin.x;
      const dy = e.clientY - origin.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < LIVE_DRAG_THRESHOLD_PX) return;

      dragOriginRef.current = null;
      onMoveRef.current(resolveDirection(dx, dy));
    },
    [resolveDirection]
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore if already released
      }
      finishDrag(e.pointerId, e.clientX, e.clientY, RELEASE_THRESHOLD_PX);
    },
    [finishDrag]
  );

  const onPointerCancel = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (dragOriginRef.current?.pointerId === e.pointerId) {
      dragOriginRef.current = null;
    }
  }, []);

  const onLostPointerCapture = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (dragOriginRef.current?.pointerId === e.pointerId) {
      dragOriginRef.current = null;
    }
  }, []);

  const onDragStart = useCallback((e: ReactDragEvent<HTMLElement>) => {
    e.preventDefault();
  }, []);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
    onDragStart,
  };
}
