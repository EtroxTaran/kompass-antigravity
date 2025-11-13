import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  TimeEntry,
  CreateTimeEntryDto,
} from '@kompass/shared/types/entities/time-entry';
import { TimeEntryStatus } from '@kompass/shared/types/entities/time-entry';
import { timeTrackingApi } from '../services/time-tracking-api';

/**
 * Timer State
 */
interface TimerState {
  activeTimer: TimeEntry | null;
  elapsedTime: number;
  isRunning: boolean;
  loading: boolean;
}

/**
 * Start Timer Parameters
 */
interface StartTimerParams {
  projectId: string;
  taskDescription: string;
  taskId?: string;
  isManualEntry: boolean;
}

/**
 * useTimer Hook
 * 
 * Custom hook for managing time tracking timer.
 * 
 * Features:
 * - Start/stop/pause timer
 * - Real-time elapsed time tracking
 * - Offline support with localStorage
 * - Automatic background persistence
 * - API integration
 * 
 * @see Phase 1.2 of Time Tracking Implementation Plan
 */
export function useTimer() {
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const STORAGE_KEY = 'kompass_active_timer';

  /**
   * Load active timer from localStorage on mount
   */
  useEffect(() => {
    const loadActiveTimer = async () => {
      // Try to load from localStorage first (offline support)
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const timer: TimeEntry = JSON.parse(stored);
          setActiveTimer(timer);
          setIsRunning(true);

          // Calculate elapsed time
          const startTime = new Date(timer.startTime).getTime();
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000);
          setElapsedTime(elapsed);
        } catch (error) {
          console.error('Failed to load timer from storage:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // Also check server for active timer (when online)
      try {
        const serverTimer = await timeTrackingApi.getActiveTimer();
        if (serverTimer) {
          setActiveTimer(serverTimer);
          setIsRunning(true);

          // Calculate elapsed time
          const startTime = new Date(serverTimer.startTime).getTime();
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000);
          setElapsedTime(elapsed);

          // Update localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverTimer));
        }
      } catch (error) {
        // Offline or API error - rely on localStorage
        console.warn('Could not fetch active timer from server:', error);
      }
    };

    loadActiveTimer();
  }, []);

  /**
   * Timer tick effect
   * 
   * Updates elapsed time every second when timer is running
   */
  useEffect(() => {
    if (isRunning && activeTimer) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRunning, activeTimer]);

  /**
   * Start timer
   */
  const startTimer = useCallback(async (params: StartTimerParams) => {
    setLoading(true);

    try {
      const dto: CreateTimeEntryDto = {
        projectId: params.projectId,
        taskId: params.taskId,
        taskDescription: params.taskDescription,
        startTime: new Date(),
        isManualEntry: params.isManualEntry,
        // endTime is not set - timer is running
      };

      // Try to create on server
      try {
        const created = await timeTrackingApi.create(dto);
        setActiveTimer(created);
        setIsRunning(true);
        setElapsedTime(0);

        // Save to localStorage for offline support
        localStorage.setItem(STORAGE_KEY, JSON.stringify(created));
      } catch (error) {
        // If offline, create locally and queue for sync
        const localTimer: TimeEntry = {
          _id: `temp-${Date.now()}`, // Temporary ID
          _rev: '',
          type: 'time_entry',
          projectId: dto.projectId,
          taskId: dto.taskId,
          taskDescription: dto.taskDescription,
          userId: 'current-user', // TODO: Get from auth context
          startTime: dto.startTime,
          durationMinutes: 0,
          status: TimeEntryStatus.IN_PROGRESS,
          isManualEntry: dto.isManualEntry,
          createdBy: 'current-user',
          createdAt: new Date(),
          modifiedBy: 'current-user',
          modifiedAt: new Date(),
          version: 1,
        };

        setActiveTimer(localTimer);
        setIsRunning(true);
        setElapsedTime(0);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localTimer));

        // TODO: Queue for sync when online
        console.warn('Timer created offline, will sync when online');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Stop timer
   */
  const stopTimer = useCallback(async () => {
    if (!activeTimer) return;

    setLoading(true);

    try {
      // Stop timer on server
      try {
        await timeTrackingApi.stopTimer(activeTimer._id);
      } catch (error) {
        // If offline, save locally and queue for sync
        console.warn('Timer stopped offline, will sync when online');
        // TODO: Queue for sync
      }

      // Clear state
      setActiveTimer(null);
      setIsRunning(false);
      setElapsedTime(0);

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, [activeTimer]);

  /**
   * Pause timer
   * 
   * Note: Pausing is implemented by stopping the current timer.
   * When resumed, a new timer is started.
   */
  const pauseTimer = useCallback(async () => {
    if (!activeTimer) return;

    setLoading(true);

    try {
      // Pause = stop timer
      await timeTrackingApi.pauseTimer(activeTimer._id);

      // Clear state
      setActiveTimer(null);
      setIsRunning(false);
      setElapsedTime(0);

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, [activeTimer]);

  /**
   * Resume timer
   * 
   * Creates a new timer with the same project/task as the previous one.
   */
  const resumeTimer = useCallback(async (previousTimer: TimeEntry) => {
    await startTimer({
      projectId: previousTimer.projectId,
      taskId: previousTimer.taskId,
      taskDescription: previousTimer.taskDescription,
      isManualEntry: false,
    });
  }, [startTimer]);

  return {
    activeTimer,
    elapsedTime,
    isRunning,
    loading,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
  };
}

