import { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { useTranslation } from '@/contexts/I18nContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskDetailsPanel } from '@/components/TaskDetailsPanel';
import { CenteredDateTime } from '@/components/DynamicGreeting';
import { UserMenu } from '@/components/UserMenu';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-productivity.webp';
import timemyworkLogoH from '@/assets/Timemywork-h.webp';
import timemyworkLogoM from '@/assets/timemywork-m.webp';

const Index = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useLocalStorage<Task[]>('timemywork-tasks', []);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);


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

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleCloseDetails = () => {
    setShowTaskDetails(false);
    setSelectedTask(null);
  };

  const handleEditFromDetails = () => {
    // Close details panel - the edit dialog will be handled by the TaskCard
    setShowTaskDetails(false);
  };

  const handleMoveTask = (taskId: number, newStatus: TaskStatus) => {
    // Get current active tasks (excluding archived)
    const currentActiveTasks = tasks.filter(task => task.status !== 'archived');

    // Prepare updates array for batch processing
    const updates: Array<{ id: number; status: TaskStatus }> = [];

    // Regras de limitação: máximo 1 task em "doing" e 1 em "progress" (Row)
    if (newStatus === 'doing') {
      const tasksInDoing = currentActiveTasks.filter(task => task.status === 'doing' && task.id !== taskId);
      if (tasksInDoing.length > 0) {
        // Check if there's already a task in progress to move the current doing task
        const tasksInProgress = currentActiveTasks.filter(task => task.status === 'progress');
        if (tasksInProgress.length > 0) {
          // Move current progress task to "To Do" first
          updates.push({ id: tasksInProgress[0].id, status: 'todo' });
        }
        // Move current doing task to progress
        updates.push({ id: tasksInDoing[0].id, status: 'progress' });
      }
    }

    if (newStatus === 'progress') {
      const tasksInProgress = currentActiveTasks.filter(task => task.status === 'progress' && task.id !== taskId);
      if (tasksInProgress.length > 0) {
        // Move a tarefa atual em "progress" para coluna "To Do"
        updates.push({ id: tasksInProgress[0].id, status: 'todo' });
      }
    }

    // Apply all updates
    updates.forEach(update => {
      handleUpdateTask(update.id, { status: update.status });
    });

    // When a task is marked as "done", automatically archive it
    const finalStatus = newStatus === 'done' ? 'archived' : newStatus;
    handleUpdateTask(taskId, { status: finalStatus });
  };

  const existingIds = tasks.map(task => task.id);

  // Filter out archived tasks for the kanban view
  const activeTasks = tasks.filter(task => task.status !== 'archived');
  const archivedTasks = tasks.filter(task => task.status === 'archived');



  // Empty state - no active tasks
  if (activeTasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative">
        {/* User Menu - Canto Superior Direito */}
        <div className="absolute top-4 right-4 z-10">
          <UserMenu taskCount={archivedTasks.length} />
        </div>
        <div className="max-w-4xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <img
                  src={timemyworkLogoH}
                  alt="Time My Work"
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0">
                {t.nav.subtitle}
              </p>
            </div>

            <CreateTaskDialog
              onCreateTask={handleCreateTask}
              existingIds={existingIds}
            />

            <p className="text-sm text-muted-foreground">
              {t.nav.createFirstTask}
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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 grid grid-cols-3 items-center">
          {/* Logo - Esquerda */}
          <div className="flex items-center">
            {/* Logo para desktop */}
            <img
              src={timemyworkLogoH}
              alt="Time My Work"
              className="hidden sm:block h-8 w-auto"
            />
            {/* Logo para mobile */}
            <img
              src={timemyworkLogoM}
              alt="Time My Work"
              className="block sm:hidden h-8 w-auto"
            />
          </div>

          {/* Data e Horário - Centro */}
          <CenteredDateTime />

          {/* Controles - Direita */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {activeTasks.length} {activeTasks.length === 1 ? t.common.task : t.common.tasks}
            </span>
            <div className="flex items-center gap-2">
              <CreateTaskDialog
                onCreateTask={handleCreateTask}
                existingIds={existingIds}
              />
              <UserMenu taskCount={archivedTasks.length} />
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={activeTasks}
        onUpdateTask={handleUpdateTask}
        onMoveTask={handleMoveTask}
        onDeleteTask={handleDeleteTask}
        onViewDetails={handleViewDetails}
      />

      {/* Task Details Panel */}
      <TaskDetailsPanel
        isOpen={showTaskDetails}
        onClose={handleCloseDetails}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        onMoveTask={handleMoveTask}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditFromDetails}
      />


    </div>
  );
};

export default Index;
