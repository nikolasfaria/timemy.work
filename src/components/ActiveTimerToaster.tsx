import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Timer,
    Play,
    Pause,
    Square,
    CheckCircle2,
    RotateCcw,
    Clock,
    X,
    Minimize2
} from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';
import { usePomodoro } from '@/hooks/usePomodoro';
import { ConfirmationDialog } from './ConfirmationDialog';
import { cn } from '@/lib/utils';

interface ActiveTimerToasterProps {
    readonly task: Task | null;
    readonly onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
    readonly onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
}

// Função auxiliar para obter conteúdo do diálogo
function getCompletionDialogContent(completionAction: 'done' | 'reset' | 'later' | null) {
    switch (completionAction) {
        case 'done':
            return {
                title: 'Marcar como Concluída',
                description: 'Tem certeza que deseja marcar esta tarefa como concluída?',
                confirmText: 'Marcar como Done',
                confirmClass: 'bg-green-600 hover:bg-green-700'
            };
        case 'reset':
            return {
                title: 'Resetar Timer',
                description: 'Deseja resetar o timer e continuar trabalhando nesta tarefa?',
                confirmText: 'Resetar Timer',
                confirmClass: 'bg-blue-600 hover:bg-blue-700'
            };
        case 'later':
            return {
                title: 'Deixar para Mais Tarde',
                description: 'A tarefa será movida de volta para "To Do". Deseja continuar?',
                confirmText: 'Mover para To Do',
                confirmClass: 'bg-orange-600 hover:bg-orange-700'
            };
        default:
            return {
                title: 'Timer Concluído! 🎉',
                description: 'Parabéns! Você completou uma sessão de foco. O que deseja fazer agora?',
                confirmText: 'OK',
                confirmClass: 'bg-primary hover:bg-primary/90'
            };
    }
}

// Componente para versão minimizada
function MinimizedToaster({ session, formatTime, onExpand }: {
    readonly session: any;
    readonly formatTime: (time: number) => string;
    readonly onExpand: () => void;
}) {
    return (
        <button
            className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-muted/50 rounded-full transition-colors border-none bg-transparent"
            onClick={onExpand}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onExpand();
                }
            }}
            aria-label="Expandir toaster do timer"
        >
            <div className="text-center">
                <Timer className="h-6 w-6 text-primary mx-auto mb-1" />
                <span className="text-xs font-mono font-bold text-primary">
                    {formatTime(session.remainingTime).slice(0, 5)}
                </span>
            </div>
        </button>
    );
}

// Componente para versão expandida
function ExpandedToaster({
    task,
    session,
    isTimerCompleted,
    formatTime,
    pauseTimer,
    stopTimer,
    onMinimize,
    onClose,
    onCompletionAction
}: {
    readonly task: Task;
    readonly session: any;
    readonly isTimerCompleted: boolean;
    readonly formatTime: (time: number) => string;
    readonly pauseTimer: () => void;
    readonly stopTimer: () => void;
    readonly onMinimize: () => void;
    readonly onClose: () => void;
    readonly onCompletionAction: (action: 'done' | 'reset' | 'later') => void;
}) {
    return (
        <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Timer className="h-4 w-4 text-primary flex-shrink-0" />
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            {isTimerCompleted ? 'Concluído!' : 'Em Andamento'}
                        </Badge>
                    </div>
                    <h4 className="font-semibold text-sm leading-tight truncate">
                        {task.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">#{task.id}</p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMinimize}
                        className="h-8 w-8 p-0 rounded-full hover:bg-muted/80"
                        aria-label="Minimizar toaster"
                    >
                        <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                        aria-label="Fechar timer"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Timer Display */}
            <div className={cn(
                "text-center py-3 px-4 rounded-lg mb-3 transition-colors",
                isTimerCompleted
                    ? "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                    : "bg-muted/30"
            )}>
                <div className={cn(
                    "text-2xl font-mono font-bold transition-colors",
                    isTimerCompleted ? "text-green-600 dark:text-green-400" : "text-primary"
                )}>
                    {isTimerCompleted ? "00:00" : formatTime(session.remainingTime)}
                </div>
                {isTimerCompleted && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-medium">
                        🎉 Sessão Concluída!
                    </p>
                )}
            </div>

            {/* Controls */}
            {isTimerCompleted ? (
                // Ações quando timer acabou
                <div className="space-y-2">
                    <Button
                        onClick={() => onCompletionAction('done')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mover para Done
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            onClick={() => onCompletionAction('reset')}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Resetar
                        </Button>
                        <Button
                            onClick={() => onCompletionAction('later')}
                            variant="outline"
                            size="sm"
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                            <Clock className="h-4 w-4 mr-1" />
                            Mais Tarde
                        </Button>
                    </div>
                </div>
            ) : (
                // Controles normais do timer
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={pauseTimer}
                        className="flex-1"
                        aria-label={session.isPaused ? "Retomar timer" : "Pausar timer"}
                    >
                        {session.isPaused ? (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                Retomar
                            </>
                        ) : (
                            <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pausar
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={stopTimer}
                        className="flex-1"
                        aria-label="Parar timer"
                    >
                        <Square className="h-4 w-4 mr-2" />
                        Parar
                    </Button>
                </div>
            )}
        </CardContent>
    );
}

export function ActiveTimerToaster({ task, onUpdateTask, onMoveTask }: ActiveTimerToasterProps) {
    const { session, pauseTimer, stopTimer, startTimer, formatTime } = usePomodoro();
    const [isMinimized, setIsMinimized] = useState(false);
    const [showCompletionDialog, setShowCompletionDialog] = useState(false);
    const [completionAction, setCompletionAction] = useState<'done' | 'reset' | 'later' | null>(null);

    // Só mostra o toaster se houver uma sessão e uma task correspondente
    if (!session || !task || session.taskId !== task.id) {
        return null;
    }

    const isTimerCompleted = session.remainingTime <= 0;

    const handleTimerComplete = () => {
        if (isTimerCompleted && !showCompletionDialog) {
            setShowCompletionDialog(true);
        }
    };

    // Verifica se o timer acabou e mostra o diálogo
    if (isTimerCompleted && !showCompletionDialog) {
        setTimeout(handleTimerComplete, 100);
    }

    const handleCompletionAction = (action: 'done' | 'reset' | 'later') => {
        setCompletionAction(action);
        setShowCompletionDialog(true);
    };

    const confirmCompletionAction = () => {
        if (!completionAction || !task) return;

        switch (completionAction) {
            case 'done':
                onMoveTask(task.id, 'done');
                break;
            case 'reset':
                startTimer(task.id, 25); // Resetar com 25 minutos por padrão
                onMoveTask(task.id, 'doing');
                break;
            case 'later':
                stopTimer();
                onMoveTask(task.id, 'todo');
                break;
        }

        setShowCompletionDialog(false);
        setCompletionAction(null);
    };

    const handleClose = () => {
        stopTimer();
    };

    const dialogContent = getCompletionDialogContent(completionAction);

    return (
        <>
            {/* Toaster Fixo */}
            <div className={cn(
                "fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",
                isMinimized ? "w-16 h-16" : "w-80 sm:w-96"
            )}>
                <Card className={cn(
                    "shadow-lg border-2 transition-all duration-300",
                    isTimerCompleted
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : "border-primary bg-background",
                    isMinimized && "rounded-full flex items-center justify-center"
                )}>
                    {isMinimized ? (
                        <MinimizedToaster
                            session={session}
                            formatTime={formatTime}
                            onExpand={() => setIsMinimized(false)}
                        />
                    ) : (
                        <ExpandedToaster
                            task={task}
                            session={session}
                            isTimerCompleted={isTimerCompleted}
                            formatTime={formatTime}
                            pauseTimer={pauseTimer}
                            stopTimer={stopTimer}
                            onMinimize={() => setIsMinimized(true)}
                            onClose={handleClose}
                            onCompletionAction={handleCompletionAction}
                        />
                    )}
                </Card>
            </div>

            {/* Dialog de Confirmação */}
            <ConfirmationDialog
                isOpen={showCompletionDialog}
                onClose={() => {
                    setShowCompletionDialog(false);
                    setCompletionAction(null);
                }}
                onConfirm={confirmCompletionAction}
                title={dialogContent.title}
                description={dialogContent.description}
            />
        </>
    );
}
