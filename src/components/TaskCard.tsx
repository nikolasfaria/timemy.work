import { useState, useEffect } from 'react';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Clock,
  CheckCircle2,
  MoreVertical,
  Timer,
  ArrowLeft,
  ListChecks,
  Settings,
  Edit3,
  Trash2,
  Eye,
  Play,
  Pause,
  Square
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task, TaskStatus } from '@/types/task';
import { usePomodoro } from '@/hooks/usePomodoro';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ConfirmationDialog } from './ConfirmationDialog';
import { CustomTimerModal } from './CustomTimerModal';
import { TimerConflictDialog } from './TimerConflictDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { TimerCompletedAlert } from './TimerCompletedAlert';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from '@/contexts/I18nContext';

interface TaskCardProps {
  readonly task: Task;
  readonly onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  readonly onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
  readonly onDeleteTask: (taskId: number) => void;
  readonly onViewDetails?: (task: Task) => void;
  readonly allTasks?: Task[]; // Para buscar o título da tarefa atual do timer
}

export function TaskCard({ task, onUpdateTask, onMoveTask, onDeleteTask, onViewDetails, allTasks = [] }: TaskCardProps) {
  const { session, startTimer, pauseTimer, stopTimer, formatTime } = usePomodoro();
  const { t } = useTranslation();
  const [showChecklist, setShowChecklist] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCustomTimer, setShowCustomTimer] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const [showTimerConflict, setShowTimerConflict] = useState(false);
  const [pendingTimerDuration, setPendingTimerDuration] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTimerCompletedAlert, setShowTimerCompletedAlert] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragMoving, setIsDragMoving] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const isMyTimer = session?.taskId === task.id;
  const completedItems = task.checklist.filter(item => item.completed).length;
  const totalItems = task.checklist.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  // Detectar quando o timer acaba
  useEffect(() => {
    if (isMyTimer && session && session.isCompleted && !showTimerCompletedAlert) {
      setShowTimerCompletedAlert(true);
    }
  }, [isMyTimer, session, showTimerCompletedAlert]);

  // Função para atualizar tempo acumulado da tarefa
  const handleTimeUpdate = (taskId: number, elapsedSeconds: number) => {
    const currentTimeSpent = task.timeSpent || 0;
    onUpdateTask(taskId, {
      timeSpent: currentTimeSpent + elapsedSeconds,
      updatedAt: new Date().toISOString()
    });
  };

  // Função para pausar timer e salvar tempo
  const handlePauseTimer = () => {
    pauseTimer(handleTimeUpdate);
  };

  // Função para parar timer e salvar tempo
  const handleStopTimer = () => {
    // Primeiro parar o timer
    stopTimer(handleTimeUpdate);

    // Usar setTimeout para garantir que o timer seja parado antes de mover a tarefa
    setTimeout(() => {
      // Mover tarefa de volta para "To Do" quando parar o timer
      if (task.status === 'doing') {
        onMoveTask(task.id, 'todo');
      }
    }, 50);
  };

  // Reorganizar checklist: pendentes primeiro, concluídos no final
  const sortedChecklist = [...task.checklist].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1; // Pendentes (false) primeiro, concluídos (true) depois
  });

  // Itens pendentes e concluídos separados
  const pendingItems = sortedChecklist.filter(item => !item.completed);
  const completedItemsList = sortedChecklist.filter(item => item.completed);

  // Lógica de exibição: mostrar apenas 3 primeiros pendentes + todos concluídos
  const itemsToShow = showAllItems
    ? sortedChecklist
    : [...pendingItems.slice(0, 3), ...completedItemsList];

  const hasMorePendingItems = pendingItems.length > 3;

  const canMarkDone = totalItems === 0 || completedItems === totalItems;

  const handlePomodoroStart = (duration: number) => {
    // Se já tem um timer ativo em outra tarefa, mostrar diálogo de conflito
    if (session && session.isActive && session.taskId !== task.id) {
      setPendingTimerDuration(duration);
      setShowTimerConflict(true);
      return;
    }

    // Se é o timer da própria tarefa e está ativo, pausar/retomar
    if (isMyTimer && session?.isActive && !session?.isPaused) {
      handlePauseTimer();
    } else if (isMyTimer && session?.isPaused) {
      // Se está pausado, retomar
      handlePauseTimer(); // A função pauseTimer alterna entre pausar e retomar
    } else {
      // Iniciar novo timer
      // Primeiro mover para "doing", depois iniciar timer
      if (task.status !== 'doing') {
        onMoveTask(task.id, 'doing');
      }
      // Usar setTimeout para garantir que o estado seja atualizado antes de iniciar o timer
      setTimeout(() => {
        startTimer(task.id, duration);
      }, 100);
    }
  };

  const handleToggleChecklist = (itemId: string) => {
    const updatedChecklist = task.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateTask(task.id, { checklist: updatedChecklist });
  };

  const handleMarkDone = () => {
    if (canMarkDone) {
      setShowConfirmDialog(true);
    }
  };

  const confirmMarkDone = () => {
    onMoveTask(task.id, 'done');
  };

  const handleCustomTimerStart = (minutes: number) => {
    // Se já tem um timer ativo em outra tarefa, mostrar diálogo de conflito
    if (session && session.isActive && session.taskId !== task.id) {
      setPendingTimerDuration(minutes);
      setShowTimerConflict(true);
      setShowCustomTimer(false);
      return;
    }

    // Primeiro mover para "doing", depois iniciar timer
    if (task.status !== 'doing') {
      onMoveTask(task.id, 'doing');
    }

    // Usar setTimeout para garantir que o estado seja atualizado antes de iniciar o timer
    setTimeout(() => {
      startTimer(task.id, minutes);
    }, 100);

    setShowCustomTimer(false);
  };

  const handleCustomTimerCancel = () => {
    setShowCustomTimer(false);
  };

  const handleTimerConflictMoveToRow = () => {
    if (session && pendingTimerDuration) {
      // Parar timer atual e mover tarefa atual para "progress" (Row)
      stopTimer();
      onMoveTask(session.taskId, 'progress');

      // Iniciar novo timer e mover nova tarefa para "doing"
      startTimer(task.id, pendingTimerDuration);
      onMoveTask(task.id, 'doing');

      // Limpar estados
      setShowTimerConflict(false);
      setPendingTimerDuration(null);
    }
  };

  const handleTimerConflictMoveToTodo = () => {
    if (session && pendingTimerDuration) {
      // Parar timer atual e mover tarefa atual para coluna "To Do"
      stopTimer();
      onMoveTask(session.taskId, 'todo');

      // Iniciar novo timer e mover nova tarefa para "doing"
      startTimer(task.id, pendingTimerDuration);
      onMoveTask(task.id, 'doing');

      // Limpar estados
      setShowTimerConflict(false);
      setPendingTimerDuration(null);
    }
  };

  const handleTimerConflictCancel = () => {
    setShowTimerConflict(false);
    setPendingTimerDuration(null);
  };

  const handleDeleteTask = () => {
    onDeleteTask(task.id);
    setShowDeleteDialog(false);
  };

  const handleEditTask = (updates: Partial<Task>) => {
    onUpdateTask(task.id, updates);
  };

  // Funções para o alert de timer concluído
  const handleTimerCompleted = () => {
    setShowTimerCompletedAlert(false);
    // Parar o timer e salvar tempo
    handleStopTimer();
  };

  const handleResetTimerFromAlert = () => {
    setShowTimerCompletedAlert(false);
    // Limpar sessão atual e iniciar nova com 25 minutos
    stopTimer();
    setTimeout(() => {
      startTimer(task.id, 25);
    }, 100);
  };

  const handleMoveToTodoFromAlert = () => {
    setShowTimerCompletedAlert(false);
    handleStopTimer();
  };

  const handleCloseTimerAlert = () => {
    setShowTimerCompletedAlert(false);
    // Limpar a sessão quando fechar o alert
    stopTimer();
  };

  // Funções para detectar clique vs drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setIsDragMoving(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartPos) {
      const deltaX = Math.abs(e.clientX - dragStartPos.x);
      const deltaY = Math.abs(e.clientY - dragStartPos.y);
      // Se moveu mais de 5px, considera como drag
      if (deltaX > 5 || deltaY > 5) {
        setIsDragMoving(true);
      }
    }
  };

  const handleInteractionEnd = () => {
    if (dragStartPos && !isDragMoving && onViewDetails) {
      // Foi um clique/toque simples, abrir sidebar
      onViewDetails(task);
    }
    setDragStartPos(null);
    setIsDragMoving(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragMoving(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartPos) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - dragStartPos.x);
      const deltaY = Math.abs(touch.clientY - dragStartPos.y);
      // Se moveu mais de 5px, considera como drag
      if (deltaX > 5 || deltaY > 5) {
        setIsDragMoving(true);
      }
    }
  };



  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="relative w-full perspective-1000" style={{ minHeight: 'fit-content' }}>
      <div
        className={cn(
          "relative w-full transition-transform duration-700 transform-style-preserve-3d",
          showChecklist && "rotate-y-180"
        )}
        style={{ minHeight: showChecklist ? 'fit-content' : 'auto' }}
      >
        {/* Front of card */}
        <article
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className={cn(
            "w-full shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-200 cursor-grab active:cursor-grabbing rounded-xl border bg-card text-card-foreground touch-manipulation backface-hidden relative",
            "active:scale-[0.98] hover:scale-[1.02]",
            isDragging && "opacity-50 shadow-lg scale-105 rotate-2",
            // Progress border-bottom minimalista
            totalItems > 0 && progressPercentage > 0 && "border-b-2 border-b-muted"
          )}
          aria-label={`${t.a11y.dragTask}: ${task.title}`}
        >
          {/* Invisible click handler overlay */}
          <div
            className="absolute inset-0 z-0"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleInteractionEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleInteractionEnd}
            aria-hidden="true"
          />
          {/* Progress line */}
          {totalItems > 0 && progressPercentage > 0 && (
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 rounded-bl-xl"
              style={{ width: `${progressPercentage}%` }}
            />
          )}
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base leading-tight truncate">{task.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">#{task.id}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3 sm:space-y-4 relative">
            {/* Description */}
            {task.description && (
              <MarkdownRenderer
                content={task.description}
                className="line-clamp-3 text-sm leading-relaxed"
              />
            )}

            {/* Timer Ativo */}
            {isMyTimer && session && !session.isCompleted && (
              <div className="bg-muted/30 rounded-lg p-3 relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-lg sm:text-xl font-mono font-bold text-center">
                      {formatTime(session.remainingTime)}
                    </span>
                    {session.isPaused && (
                      <span className="text-xs text-muted-foreground">(pausado)</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePauseTimer();
                      }}
                      className="h-8 w-8 p-0 rounded-full hover:bg-background/80 touch-manipulation"
                      aria-label={session.isPaused ? "Retomar timer" : "Pausar timer"}
                    >
                      {session.isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStopTimer();
                      }}
                      className="h-8 w-8 p-0 rounded-full hover:bg-background/80 touch-manipulation"
                      aria-label="Parar timer"
                    >
                      <Square className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {/* Tempo acumulado */}
                {!!(task.timeSpent && task.timeSpent > 0) && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Tempo total: {Math.floor(task.timeSpent / 60)}min {task.timeSpent % 60}s
                  </div>
                )}
              </div>
            )}

            {/* Tempo acumulado (quando não há timer ativo) */}
            {!isMyTimer && !!(task.timeSpent && task.timeSpent > 0) && (
              <div className="text-xs text-muted-foreground">
                Tempo trabalhado: {Math.floor(task.timeSpent / 60)}min {task.timeSpent % 60}s
              </div>
            )}



            {/* Action Icons - Bottom Right */}
            <div className="flex items-center justify-end gap-1 pt-2 relative z-10">
              {/* View Details */}
              {onViewDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(task);
                  }}
                  className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 touch-manipulation"
                  aria-label={`Ver detalhes da tarefa: ${task.title}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}

              {/* Checklist Toggle */}
              {totalItems > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowChecklist(!showChecklist);
                  }}
                  className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 touch-manipulation"
                  aria-label={`${showChecklist ? t.taskCard.hideChecklist : t.taskCard.showChecklist} - ${totalItems} itens`}
                >
                  <ListChecks className="h-4 w-4" />
                </Button>
              )}

              {/* Pomodoro Timer - apenas para tarefas em "doing" */}
              {!isMyTimer && task.status === 'doing' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 touch-manipulation"
                      aria-label={`${t.a11y.pomodoroTimer} - ${task.title}`}
                    >
                      <Timer className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-popover min-w-[160px]">
                    <DropdownMenuItem
                      onClick={() => handlePomodoroStart(5)}
                      className="py-2.5 px-3 text-sm"
                    >
                      <Clock className="h-4 w-4 mr-3" />
                      5 {t.taskCard.minutes}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePomodoroStart(15)}
                      className="py-2.5 px-3 text-sm"
                    >
                      <Clock className="h-4 w-4 mr-3" />
                      15 {t.taskCard.minutes}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePomodoroStart(25)}
                      className="py-2.5 px-3 text-sm"
                    >
                      <Clock className="h-4 w-4 mr-3" />
                      25 {t.taskCard.minutes}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowCustomTimer(true)}
                      className="py-2.5 px-3 text-sm border-t"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      CUSTOM
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 touch-manipulation"
                    aria-label={`${t.a11y.taskMenu} - ${task.title}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover">
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleMarkDone}
                    disabled={!canMarkDone}
                    className={cn(!canMarkDone && "opacity-50 cursor-not-allowed")}
                    aria-label={`${t.taskCard.markAsDone} - ${task.title}`}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {t.taskCard.markAsDone}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </article>

        {/* Back of card - Checklist */}
        <article
          className={cn(
            "absolute top-0 left-0 w-full shadow-[var(--shadow-card)] rounded-xl border bg-card text-card-foreground backface-hidden rotate-y-180",
            showChecklist ? "min-h-fit" : "h-full"
          )}
        >
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base leading-tight truncate">{task.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">Checklist ({completedItems}/{totalItems})</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChecklist(false)}
                className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 touch-manipulation"
                aria-label="Voltar para frente do card"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3 sm:space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground font-medium">{t.taskCard.progress}</span>
                <span className="font-semibold">{completedItems}/{totalItems}</span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2 sm:h-2.5"
                aria-label={`${t.a11y.taskProgress}: ${completedItems} de ${totalItems} itens concluídos`}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
              {itemsToShow.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleChecklist(item.id)}
                    className="h-4 w-4 mt-0.5 touch-manipulation"
                    aria-label={`${t.a11y.checklistItem}: ${item.text}`}
                  />
                  <span className={cn(
                    "text-xs sm:text-sm flex-1 leading-relaxed",
                    item.completed && "line-through text-muted-foreground"
                  )}>
                    {item.text}
                  </span>
                </div>
              ))}

              {/* Botão "Mostrar Mais" */}
              {hasMorePendingItems && !showAllItems && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllItems(true)}
                  className="w-full py-2 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                >
                  Mostrar mais {pendingItems.length - 3} itens...
                </Button>
              )}

              {/* Botão "Mostrar Menos" */}
              {showAllItems && hasMorePendingItems && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllItems(false)}
                  className="w-full py-2 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                >
                  Mostrar menos
                </Button>
              )}
            </div>
          </CardContent>
        </article>
      </div>

      {/* Custom Timer Modal */}
      <CustomTimerModal
        isOpen={showCustomTimer}
        onClose={handleCustomTimerCancel}
        onConfirm={handleCustomTimerStart}
        taskTitle={task.title}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmMarkDone}
        type="markDone"
      />

      {/* Timer Conflict Dialog */}
      {session && (
        <TimerConflictDialog
          isOpen={showTimerConflict}
          onClose={handleTimerConflictCancel}
          onMoveToRow={handleTimerConflictMoveToRow}
          onMoveToTodo={handleTimerConflictMoveToTodo}
          currentTaskTitle={allTasks.find(t => t.id === session.taskId)?.title || `Tarefa #${session.taskId}`}
          newTaskTitle={task.title}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteTask}
        type="delete"
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleEditTask}
        task={task}
      />

      {/* Timer Completed Alert */}
      <TimerCompletedAlert
        isOpen={showTimerCompletedAlert}
        task={task}
        onClose={handleCloseTimerAlert}
        onMarkDone={handleTimerCompleted}
        onResetTimer={handleResetTimerFromAlert}
        onMoveToTodo={handleMoveToTodoFromAlert}
      />
    </div>
  );
}