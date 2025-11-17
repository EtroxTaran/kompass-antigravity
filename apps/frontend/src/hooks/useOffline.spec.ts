import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useOffline } from './useOffline';

describe('useOffline', () => {
  beforeEach(() => {
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return online status initially', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });

    const { result } = renderHook(() => useOffline());

    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });

  it('should return offline status initially', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false,
    });

    const { result } = renderHook(() => useOffline());

    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);
  });

  it('should update when online event fires', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false,
    });

    const { result } = renderHook(() => useOffline());

    expect(result.current.isOffline).toBe(true);

    // Simulate going online
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        configurable: true,
        value: true,
      });

      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => {
      expect(result.current.isOnline).toBe(true);
      expect(result.current.isOffline).toBe(false);
    });
  });

  it('should update when offline event fires', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });

    const { result } = renderHook(() => useOffline());

    expect(result.current.isOnline).toBe(true);

    // Simulate going offline
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        configurable: true,
        value: false,
      });

      window.dispatchEvent(new Event('offline'));
    });

    await waitFor(() => {
      expect(result.current.isOnline).toBe(false);
      expect(result.current.isOffline).toBe(true);
    });
  });

  it('should handle multiple online/offline events', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });

    const { result } = renderHook(() => useOffline());

    // Go offline
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        configurable: true,
        value: false,
      });
      window.dispatchEvent(new Event('offline'));
    });

    await waitFor(() => {
      expect(result.current.isOffline).toBe(true);
    });

    // Go online
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        configurable: true,
        value: true,
      });
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => {
      expect(result.current.isOnline).toBe(true);
    });
  });
});
