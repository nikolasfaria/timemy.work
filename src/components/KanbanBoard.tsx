import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useState } from 'react';
import { useTranslation } from '@/contexts/I18nContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { KanbanMobileView } from './KanbanMobileView';
import { ConfirmationDialog } from './ConfirmationDialog';

interface KanbanBoardProps {
  readonly tasks: Task[];
  readonly onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  readonly onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
  readonly onDeleteTask: (taskId: number) => void;
  readonly onViewDetails?: (task: Task) => void;
  readonly onCreateTask?: () => void;
}

const COLUMNS: TaskStatus[] = ['todo', 'row', 'doing', 'done'];

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  allTasks: Task[];
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: number) => void;
  onViewDetails?: (task: Task) => void;
}

function Column({ status, tasks, allTasks, onUpdateTask, onMoveTask, onDeleteTask, onViewDetails }: ColumnProps) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const getTitle = () => {
    switch (status) {
      case 'todo': return t.kanban.columns.todo;
      case 'row': return t.kanban.columns.row;
      case 'doing': return t.kanban.columns.doing;
      case 'done': return t.kanban.columns.done;
      default: return status;
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col h-full rounded-xl transition-all duration-200",
        isOver && "ring-2 ring-primary/50 scale-[1.02]"
      )}
    >
      <Card className="flex flex-col h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-semibold truncate">
              {getTitle()}
            </CardTitle>
            <Badge
              variant="secondary"
              className="text-muted-foreground bg-muted font-medium px-2.5 py-1 rounded-full"
            >
              {tasks.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-3 sm:px-6 flex-1">
          <SortableContext
            items={tasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={cn(
              "space-y-3 sm:space-y-4 min-h-[300px] sm:min-h-[400px] p-2 rounded-lg",
              isOver && "bg-primary/5"
            )}>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  allTasks={allTasks}
                  onUpdateTask={onUpdateTask}
                  onMoveTask={onMoveTask}
                  onDeleteTask={onDeleteTask}
                  onViewDetails={onViewDetails}
                />
              ))}

              {tasks.length === 0 && (
                <div className="flex items-center justify-center h-full min-h-[200px] text-center">
                  <p className="text-sm text-muted-foreground">
                    {isOver ? "Solte aqui" : t.kanban.noTasks}
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

export function KanbanBoard({ tasks, onUpdateTask, onMoveTask, onDeleteTask, onViewDetails, onCreateTask }: KanbanBoardProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [showDoneConfirm, setShowDoneConfirm] = useState(false);
  const [pendingDoneTask, setPendingDoneTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    console.log('🚀 Drag Start:', event.active.id);
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('🎯 Drag End:', { activeId: active.id, overId: over?.id });

    if (!over) {
      console.log('❌ No drop target');
      setActiveId(null);
      return;
    }

    const activeTaskId = active.id as number;
    const overId = over.id;

    // Reset active
    setActiveId(null);

    // Find the active task
    const activeTask = tasks.find(t => t.id === activeTaskId);
    if (!activeTask) return;

    // Case 1: Dropped on another task
    const overTask = tasks.find(t => t.id === overId);
    if (overTask) {
      if (activeTask.status === overTask.status) {
        // Reorder in same column
        const columnTasks = tasks
          .filter(t => t.status === activeTask.status)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        const oldIndex = columnTasks.findIndex(t => t.id === activeTaskId);
        const newIndex = columnTasks.findIndex(t => t.id === overId);

        if (oldIndex !== newIndex) {
          const newTasks = [...columnTasks];
          newTasks.splice(oldIndex, 1);
          newTasks.splice(newIndex, 0, activeTask);

          newTasks.forEach((task, index) => {
            onUpdateTask(task.id, { order: index });
          });
        }
      } else {
        // Move to different column (at the position of the target task)
        if (overTask.status === 'done') {
          setPendingDoneTask(activeTask);
          setShowDoneConfirm(true);
        } else {
          onMoveTask(activeTaskId, overTask.status);
        }
      }
      return;
    }

    // Case 2: Dropped on a column
    if (COLUMNS.includes(overId as TaskStatus)) {
      const targetStatus = overId as TaskStatus;
      console.log('📦 Dropped on column:', targetStatus, 'Current status:', activeTask.status);

      if (activeTask.status !== targetStatus) {
        console.log('✅ Moving task to:', targetStatus);
        if (targetStatus === 'done') {
          setPendingDoneTask(activeTask);
          setShowDoneConfirm(true);
        } else {
          onMoveTask(activeTaskId, targetStatus);
        }
      } else {
        console.log('⚠️ Same column, no move needed');
      }
    } else {
      console.log('❌ Invalid drop target:', overId);
    }
  };

  const handleConfirmDone = () => {
    if (pendingDoneTask) {
      onMoveTask(pendingDoneTask.id, 'done');
      setPendingDoneTask(null);
      setShowDoneConfirm(false);
    }
  };

  const handleCancelDone = () => {
    setPendingDoneTask(null);
    setShowDoneConfirm(false);
  };

  // Mobile view
  if (isMobile) {
    return (
      <KanbanMobileView
        tasks={tasks}
        onUpdateTask={onUpdateTask}
        onMoveTask={onMoveTask}
        onDeleteTask={onDeleteTask}
        onViewDetails={onViewDetails}
        onCreateTask={onCreateTask || (() => { })}
      />
    );
  }

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  // Desktop view
  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
          {COLUMNS.map((status) => {
            const columnTasks = tasks
              .filter(task => task.status === status)
              .sort((a, b) => (a.order || 0) - (b.order || 0));

            return (
              <Column
                key={status}
                status={status}
                tasks={columnTasks}
                allTasks={tasks}
                onUpdateTask={onUpdateTask}
                onMoveTask={onMoveTask}
                onDeleteTask={onDeleteTask}
                onViewDetails={onViewDetails}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="drag-rotation is-dragging">
              <TaskCard
                task={activeTask}
                allTasks={tasks}
                onUpdateTask={onUpdateTask}
                onMoveTask={onMoveTask}
                onDeleteTask={onDeleteTask}
                onViewDetails={onViewDetails}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <ConfirmationDialog
        isOpen={showDoneConfirm}
        onClose={handleCancelDone}
        onConfirm={handleConfirmDone}
        type="markDone"
      />
    </>
  );
}
