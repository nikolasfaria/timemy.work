import { useState, useEffect, useCallback } from 'react';
import { PomodoroSession } from '@/types/task';

const POMODORO_STORAGE_KEY = 'pomodoro-session';

export function usePomodoro() {
  const [session, setSession] = useState<PomodoroSession | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(POMODORO_STORAGE_KEY);
    if (savedSession) {
      try {
        const parsedSession: PomodoroSession = JSON.parse(savedSession);

        // Calculate remaining time based on elapsed time
        if (parsedSession.isActive && parsedSession.startTime) {
          const now = Date.now();
          let elapsedSeconds: number;

          if (parsedSession.isPaused && parsedSession.pausedAt) {
            // If paused, only count time until pause
            elapsedSeconds = Math.floor((parsedSession.pausedAt - parsedSession.startTime) / 1000);
          } else {
            // If running, count total elapsed time
            elapsedSeconds = Math.floor((now - parsedSession.startTime) / 1000);
          }

          const totalDurationInSeconds = parsedSession.duration * 60;
          const remainingTime = Math.max(0, totalDurationInSeconds - elapsedSeconds);

          if (remainingTime > 0) {
            setSession({
              ...parsedSession,
              remainingTime
            });
          } else {
            // Timer already completed while browser was closed
            localStorage.removeItem(POMODORO_STORAGE_KEY);
            playCompletionSound();
          }
        }
      } catch (error) {
        console.error('Error loading pomodoro session:', error);
        localStorage.removeItem(POMODORO_STORAGE_KEY);
      }
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session) {
      localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(POMODORO_STORAGE_KEY);
    }
  }, [session]);

  // Timer effect
  useEffect(() => {
    if (!session || !session.isActive || session.isPaused) return;

    const interval = setInterval(() => {
      setSession(prev => {
        if (!prev) return null;

        // Calculate remaining time based on actual elapsed time
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - (prev.startTime || now)) / 1000);
        const totalDurationInSeconds = prev.duration * 60;
        const remainingTime = Math.max(0, totalDurationInSeconds - elapsedSeconds);

        if (remainingTime <= 0) {
          // Timer completed
          playCompletionSound();
          return {
            ...prev,
            remainingTime: 0,
            isActive: false,
            isCompleted: true
          };
        }

        return { ...prev, remainingTime };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.isActive, session?.isPaused]);

  const startTimer = useCallback((taskId: number, duration: number) => {
    setSession({
      taskId,
      duration,
      startTime: Date.now(),
      isActive: true,
      isPaused: false,
      remainingTime: duration * 60, // convert minutes to seconds
    });
  }, []);

  const pauseTimer = useCallback((onTimeUpdate?: (taskId: number, timeSpent: number) => void) => {
    setSession(prev => {
      if (!prev) return null;

      const now = Date.now();

      if (prev.isPaused) {
        // Resuming: adjust startTime to account for paused duration
        const pausedDuration = now - (prev.pausedAt || now);
        return {
          ...prev,
          isPaused: false,
          startTime: (prev.startTime || now) + pausedDuration,
          pausedAt: undefined
        };
      } else {
        // Pausing: calculate elapsed time and update task
        const elapsedTime = prev.startTime ? Math.floor((now - prev.startTime) / 1000) : 0;
        if (onTimeUpdate && elapsedTime > 0) {
          onTimeUpdate(prev.taskId, elapsedTime);
        }

        return {
          ...prev,
          isPaused: true,
          pausedAt: now
        };
      }
    });
  }, []);

  const stopTimer = useCallback((onTimeUpdate?: (taskId: number, timeSpent: number) => void) => {
    setSession(prev => {
      if (prev && onTimeUpdate) {
        const now = Date.now();
        const elapsedTime = prev.startTime ? Math.floor((now - prev.startTime) / 1000) : 0;
        if (elapsedTime > 0) {
          onTimeUpdate(prev.taskId, elapsedTime);
        }
      }
      return null;
    });

    // Garantir que o localStorage seja limpo imediatamente
    localStorage.removeItem(POMODORO_STORAGE_KEY);
  }, []);

  const playCompletionSound = useCallback(() => {
    try {
      // Create a more prominent notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Play multiple beeps with different frequencies for a richer sound
      const frequencies = [800, 1000, 1200, 1000, 800];
      const beepDuration = 0.3;
      const pauseDuration = 0.1;

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const startTime = audioContext.currentTime + (index * (beepDuration + pauseDuration));
        const endTime = startTime + beepDuration;

        oscillator.frequency.setValueAtTime(freq, startTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.6, startTime + 0.05); // Volume mais alto
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

        oscillator.start(startTime);
        oscillator.stop(endTime);
      });
    } catch (error) {
      console.warn('Could not play completion sound:', error);
    }
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    session,
    startTimer,
    pauseTimer,
    stopTimer,
    formatTime,
  };
}