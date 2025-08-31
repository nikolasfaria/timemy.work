import { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Timer, Plus } from 'lucide-react';
import heroImage from '@/assets/hero-productivity.jpg';

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('timemywork-tasks', []);

  const handleCreateTask = (newTaskData: Omit<Task, 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...newTaskData,
      createdAt: now,
      updatedAt: now,
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId: number, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const handleMoveTask = (taskId: number, newStatus: TaskStatus) => {
    handleUpdateTask(taskId, { status: newStatus });
  };

  const existingIds = tasks.map(task => task.id);

  // Empty state - no tasks created yet
  if (tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-4xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Timer className="h-8 w-8" />
                <h1 className="text-4xl font-bold">time my work</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0">
                Organize suas tarefas com kanban e aumente sua produtividade com pomodoro
              </p>
            </div>
            
            <CreateTaskDialog 
              onCreateTask={handleCreateTask}
              existingIds={existingIds}
            />
            
            <p className="text-sm text-muted-foreground">
              Crie sua primeira tarefa para começar
            </p>
          </div>
          
          <div className="hidden lg:block">
            <img 
              src={heroImage} 
              alt="Plataforma de produtividade com kanban e pomodoro" 
              className="w-full h-auto rounded-lg shadow-[var(--shadow-elevated)]"
            />
          </div>
        </div>
      </div>
    );
  }

  // Kanban view - tasks exist
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-6 w-6" />
            <h1 className="text-2xl font-bold">time my work</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''}
            </span>
            <CreateTaskDialog 
              onCreateTask={handleCreateTask}
              existingIds={existingIds}
            />
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <KanbanBoard 
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onMoveTask={handleMoveTask}
      />
    </div>
  );
};

export default Index;
