import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useTranslation } from '@/contexts/I18nContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Calendar,
    Clock,
    CheckCircle2,
    Edit3,
    Trash2,
    Play,
    Pause,
    Square,
    Timer
} from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';
import { MarkdownRenderer } from './MarkdownRenderer';

import { cn } from '@/lib/utils';

interface TaskDetailsPanelProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly task: Task | null;
    readonly onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
    readonly onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
    readonly onDeleteTask: (taskId: number) => void;
    readonly onEditTask: () => void;
}

export function TaskDetailsPanel({
    isOpen,
    onClose,
    task,
    onUpdateTask,
    onMoveTask,
    onDeleteTask,
    onEditTask
}: TaskDetailsPanelProps) {
    const { t } = useTranslation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { session, startTimer, pauseTimer, stopTimer, formatTime } = usePomodoro();

    if (!task) return null;

    const completedItems = task.checklist?.filter(item => item.completed).length || 0;
    const totalItems = task.checklist?.length || 0;
    const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    // Verificar se o timer ativo é desta tarefa
    const isMyTimer = session?.taskId === task.id;

    // Função para atualizar tempo acumulado da tarefa
    const handleTimeUpdate = (taskId: number, elapsedSeconds: number) => {
        const currentTimeSpent = task.timeSpent || 0;
        onUpdateTask(taskId, {
            timeSpent: currentTimeSpent + elapsedSeconds
        });
    };

    const handleStartTimer = (duration: number) => {
        startTimer(task.id, duration, handleTimeUpdate);
        if (task.status !== 'doing') {
            onMoveTask(task.id, 'doing');
        }
    };

    const handlePauseTimer = () => {
        pauseTimer(handleTimeUpdate);
    };

    const handleStopTimer = () => {
        stopTimer(handleTimeUpdate);
        if (task.status === 'doing') {
            onMoveTask(task.id, 'todo');
        }
    };
    const canMarkDone = totalItems === 0 || completedItems === totalItems;

    const handleMarkDone = () => {
        if (canMarkDone) {
            onMoveTask(task.id, 'done');
            onClose();
        }
    };

    const handleDelete = () => {
        if (showDeleteConfirm) {
            onDeleteTask(task.id);
            onClose();
        } else {
            setShowDeleteConfirm(true);
            setTimeout(() => setShowDeleteConfirm(false), 3000); // Auto-cancel after 3s
        }
    };

    const getStatusColor = (status: TaskStatus) => {
        const colors = {
            todo: 'bg-slate-100 text-slate-800',
            progress: 'bg-yellow-100 text-yellow-800',
            doing: 'bg-blue-100 text-blue-800',
            done: 'bg-green-100 text-green-800',
            archived: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || colors.todo;
    };

    const getStatusLabel = (status: TaskStatus) => {
        const labels = {
            todo: 'To Do',
            progress: 'In Progress',
            doing: 'Row',
            done: 'Done',
            archived: 'Archived'
        };
        return labels[status] || status;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader className="space-y-4">
                    <div className="flex-1 min-w-0">
                        <SheetTitle className="text-xl font-semibold leading-tight">
                            {task.title}
                        </SheetTitle>
                        <SheetDescription className="text-sm text-muted-foreground mt-1">
                            #{task.id}
                        </SheetDescription>
                    </div>

                    {/* Status and Effort */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn("text-xs px-2 py-1", getStatusColor(task.status))}>
                            {getStatusLabel(task.status)}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-1">
                            {task.effort}
                        </Badge>
                    </div>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    {/* Description */}
                    {task.description && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">{t.task.description}</h3>
                            <div className="prose prose-sm max-w-none">
                                <MarkdownRenderer content={task.description} />
                            </div>
                        </div>
                    )}

                    {/* Timer Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            Pomodoro Timer
                        </h3>

                        {/* Timer Ativo */}
                        {isMyTimer && session && !session.isCompleted ? (
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 rounded-md px-4 py-3">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-yellow-400 dark:bg-yellow-500 rounded-full animate-pulse"></div>
                                        <span className="text-lg font-mono font-medium text-yellow-800 dark:text-yellow-200">
                                            {formatTime(session.remainingTime)}
                                        </span>
                                        {session.isPaused && (
                                            <span className="text-sm text-yellow-600 dark:text-yellow-400">paused</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePauseTimer}
                                        className="flex-1 h-9 flex items-center justify-center gap-2 rounded-md bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 transition-colors"
                                    >
                                        {session.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                                        {session.isPaused ? t.task.resumeTimer || 'Resume' : t.task.pauseTimer || 'Pause'}
                                    </button>
                                    <button
                                        onClick={handleStopTimer}
                                        className="flex-1 h-9 flex items-center justify-center gap-2 rounded-md bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-800 dark:text-red-200 transition-colors"
                                    >
                                        <Square className="h-4 w-4" />
                                        {t.task.stopTimer || 'Stop'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Timer Inativo - Botões para Iniciar */
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleStartTimer(25)}
                                    className="h-10 flex items-center justify-center gap-2 rounded-md border border-border hover:bg-accent transition-colors"
                                    disabled={task.status !== 'doing'}
                                >
                                    <Timer className="h-4 w-4" />
                                    25 {t.common.minutes || 'min'}
                                </button>
                                <button
                                    onClick={() => handleStartTimer(15)}
                                    className="h-10 flex items-center justify-center gap-2 rounded-md border border-border hover:bg-accent transition-colors"
                                    disabled={task.status !== 'doing'}
                                >
                                    <Timer className="h-4 w-4" />
                                    15 {t.common.minutes || 'min'}
                                </button>
                                <button
                                    onClick={() => handleStartTimer(5)}
                                    className="h-10 flex items-center justify-center gap-2 rounded-md border border-border hover:bg-accent transition-colors"
                                    disabled={task.status !== 'doing'}
                                >
                                    <Timer className="h-4 w-4" />
                                    5 {t.common.minutes || 'min'}
                                </button>
                                <button
                                    onClick={() => handleStartTimer(10)}
                                    className="h-10 flex items-center justify-center gap-2 rounded-md border border-border hover:bg-accent transition-colors"
                                    disabled={task.status !== 'doing'}
                                >
                                    <Timer className="h-4 w-4" />
                                    10 {t.common.minutes || 'min'}
                                </button>
                            </div>
                        )}

                        {/* Tempo Acumulado */}
                        {task.timeSpent && task.timeSpent > 0 && (
                            <div className="text-xs text-muted-foreground">
                                Total time: {Math.floor(task.timeSpent / 60)}m {task.timeSpent % 60}s
                            </div>
                        )}

                        {task.status !== 'doing' && (
                            <p className="text-xs text-muted-foreground">
                                {t.task.timerOnlyInRow}
                            </p>
                        )}
                    </div>

                    {/* Checklist */}
                    {task.checklist && task.checklist.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    {t.task.checklist} ({completedItems}/{totalItems})
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                    {Math.round(progressPercentage)}%
                                </span>
                            </div>

                            <Progress value={progressPercentage} className="h-2" />

                            <div className="space-y-2">
                                {task.checklist.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                        <Checkbox
                                            checked={item.completed}
                                            onCheckedChange={(checked) => {
                                                const updatedChecklist = task.checklist?.map(checklistItem =>
                                                    checklistItem.id === item.id ? { ...checklistItem, completed: !!checked } : checklistItem
                                                ) || [];
                                                onUpdateTask(task.id, { checklist: updatedChecklist });
                                            }}
                                            className="mt-0.5"
                                        />
                                        <span className={cn(
                                            "text-sm flex-1 leading-relaxed",
                                            item.completed && "line-through text-muted-foreground"
                                        )}>
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="space-y-3 pt-4 border-t">
                        <h3 className="text-sm font-medium text-muted-foreground">Informações</h3>
                        <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>Criado: {formatDate(task.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>Atualizado: {formatDate(task.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t">
                        <h3 className="text-sm font-medium text-muted-foreground">Ações</h3>
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEditTask}
                                className="justify-start"
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Editar Tarefa
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkDone}
                                disabled={!canMarkDone}
                                className="justify-start"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Marcar como Concluída
                            </Button>

                            <Button
                                variant={showDeleteConfirm ? "destructive" : "outline"}
                                size="sm"
                                onClick={handleDelete}
                                className="justify-start"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {showDeleteConfirm ? "Confirmar Exclusão" : "Excluir Tarefa"}
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
