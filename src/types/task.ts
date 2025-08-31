export type TaskStatus = 'todo' | 'progress' | 'doing' | 'done';

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
}

export interface PomodoroSession {
  taskId: number;
  duration: number; // in minutes
  startTime?: number;
  endTime?: number;
  isActive: boolean;
  isPaused: boolean;
  remainingTime: number; // in seconds
}