import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { useTranslation } from '@/contexts/I18nContext';
import { ConfirmationDialog } from './ConfirmationDialog';

interface KanbanBoardProps {
  readonly tasks: Task[];
  readonly onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  readonly onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
  readonly onDeleteTask: (taskId: number) => void;
  readonly onViewDetails?: (task: Task) => void;
}

// Column configuration - titles will be translated dynamically
const COLUMN_CONFIG = [
  { id: 'todo', color: 'bg-kanban-todo' },
  { id: 'progress', color: 'bg-kanban-progress' },
  { id: 'doing', color: 'bg-kanban-doing' },
  { id: 'done', color: 'bg-kanban-done' },
] as const;

interface DroppableColumnProps {
  readonly column: { readonly id: string; readonly title: string; readonly color: string };
  readonly tasks: Task[];
  readonly allTasks: Task[];
  readonly onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  readonly onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
  readonly onDeleteTask: (taskId: number) => void;
  readonly onViewDetails?: (task: Task) => void;
}

function DroppableColumn({ column, tasks, allTasks, onUpdateTask, onMoveTask, onDeleteTask, onViewDetails }: DroppableColumnProps) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col">
      <Card
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] transition-all duration-200 rounded-xl",
          isOver && "bg-muted/30 ring-2 ring-primary/20 scale-[1.02]"
        )}
      >
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-semibold truncate">
              {column.title}
            </CardTitle>
            <Badge
              variant="secondary"
              className="text-muted-foreground bg-muted font-medium px-2.5 py-1 rounded-full"
            >
              {tasks.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-3 sm:px-6">
          <SortableContext
            items={tasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3 sm:space-y-4 min-h-[300px] sm:min-h-[400px]">
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
                <output
                  className="text-center py-8 text-muted-foreground block"
                  aria-label={`${t.a11y.dropZone} - ${column.title}`}
                >
                  <p className="text-sm">{t.kanban.noTasks}</p>
                </output>
              )}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

export function KanbanBoard({ tasks, onUpdateTask, onMoveTask, onDeleteTask, onViewDetails }: KanbanBoardProps) {
  const { t } = useTranslation();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showDragConfirmDialog, setShowDragConfirmDialog] = useState(false);
  const [pendingDragTask, setPendingDragTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    })
  );

  const getTasksForColumn = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the active and over tasks
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Check if we're dropping over a column
    const overColumn = COLUMN_CONFIG.find(col => col.id === overId);
    if (overColumn) {
      // Move task to new column
      if (activeTask.status !== overColumn.id) {
        onMoveTask(activeTask.id, overColumn.id as TaskStatus);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Check if we're dropping over a column
    const overColumn = COLUMN_CONFIG.find(col => col.id === overId);
    if (overColumn) {
      // Se estiver tentando mover para "done", mostrar popup de confirmação
      if (overColumn.id === 'done') {
        // Verificar se a tarefa pode ser marcada como done (checklist completo)
        const completedItems = activeTask.checklist?.filter(item => item.completed).length || 0;
        const totalItems = activeTask.checklist?.length || 0;
        const canMarkDone = totalItems === 0 || completedItems === totalItems;

        if (canMarkDone) {
          setPendingDragTask(activeTask);
          setShowDragConfirmDialog(true);
        } else {
          // Se não pode marcar como done, não faz nada (ou poderia mostrar um toast de erro)
          return;
        }
      } else {
        // Para outras colunas, mover normalmente
        onMoveTask(activeTask.id, overColumn.id as TaskStatus);
      }
    }
  };

  // Funções para lidar com a confirmação do drag para "done"
  const handleConfirmDragToDone = () => {
    if (pendingDragTask) {
      onMoveTask(pendingDragTask.id, 'done');
      setPendingDragTask(null);
      setShowDragConfirmDialog(false);
    }
  };

  const handleCancelDragToDone = () => {
    setPendingDragTask(null);
    setShowDragConfirmDialog(false);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
        {COLUMN_CONFIG.map((columnConfig) => {
          const columnTasks = getTasksForColumn(columnConfig.id as TaskStatus);

          // Get translated title
          const getColumnTitle = (id: string) => {
            switch (id) {
              case 'todo': return t.kanban.columns.todo;
              case 'progress': return t.kanban.columns.progress;
              case 'doing': return t.kanban.columns.doing;
              case 'done': return t.kanban.columns.done;
              default: return id;
            }
          };

          const column = {
            ...columnConfig,
            title: getColumnTitle(columnConfig.id)
          };

          return (
            <DroppableColumn
              key={columnConfig.id}
              column={column}
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
        {activeTask ? (
          <TaskCard
            task={activeTask}
            allTasks={tasks}
            onUpdateTask={onUpdateTask}
            onMoveTask={onMoveTask}
            onDeleteTask={onDeleteTask}
            onViewDetails={onViewDetails}
          />
        ) : null}
      </DragOverlay>

      {/* Confirmation Dialog for Drag to Done */}
      <ConfirmationDialog
        isOpen={showDragConfirmDialog}
        onClose={handleCancelDragToDone}
        onConfirm={handleConfirmDragToDone}
        type="markDone"
      />
    </DndContext>
  );
}