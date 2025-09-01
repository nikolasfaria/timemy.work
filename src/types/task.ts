export type TaskStatus = 'todo' | 'progress' | 'doing' | 'done' | 'archived';

export type Effort = 'XS' | 'S' | 'M' | 'L' | 'XL';

export type Complexity = 'Easy' | 'Medium' | 'Hard';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  checklist: ChecklistItem[];
  effort: Effort;
  complexity: Complexity;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  timeSpent?: number; // tempo acumulado em segundos
  githubUrl?: string; // URL do GitHub
  pipefyUrl?: string; // URL do Pipefy
  notionUrl?: string; // URL do Notion
}

export interface PomodoroSession {
  taskId: number;
  duration: number; // in minutes
  startTime?: number;
  endTime?: number;
  isActive: boolean;
  isPaused: boolean;
  pausedAt?: number; // timestamp when paused
  remainingTime: number; // in seconds
  isCompleted?: boolean; // indica se o timer foi concluído
}