import { useState, useEffect, useCallback } from 'react';
import { PomodoroSession } from '@/types/task';

export function usePomodoro() {
  const [session, setSession] = useState<PomodoroSession | null>(null);

  // Timer effect
  useEffect(() => {
    if (!session || !session.isActive || session.isPaused) return;

    const interval = setInterval(() => {
      setSession(prev => {
        if (!prev || prev.remainingTime <= 0) {
          // Timer completed
          playCompletionSound();
          return null;
        }
        return { ...prev, remainingTime: prev.remainingTime - 1 };
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

  const pauseTimer = useCallback(() => {
    setSession(prev => prev ? { ...prev, isPaused: !prev.isPaused } : null);
  }, []);

  const stopTimer = useCallback(() => {
    setSession(null);
  }, []);

  const playCompletionSound = useCallback(() => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
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