import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, RotateCcw, Clock, X } from 'lucide-react';
import { Task } from '@/types/task';

interface TimerCompletedAlertProps {
    readonly isOpen: boolean;
    readonly task: Task | null;
    readonly onClose: () => void;
    readonly onMarkDone: () => void;
    readonly onResetTimer: () => void;
    readonly onMoveToTodo: () => void;
}

export function TimerCompletedAlert({
    isOpen,
    task,
    onClose,
    onMarkDone,
    onResetTimer,
    onMoveToTodo
}: TimerCompletedAlertProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            // Delay hiding to allow animation
            const timeout = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    if (!isVisible || !task) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
            }`}>
            <div className={`max-w-md w-full mx-4 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}>
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950 shadow-2xl">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <AlertTitle className="text-green-800 dark:text-green-200 text-lg font-semibold">
                                    🎉 Timer Concluído!
                                </AlertTitle>
                                <AlertDescription className="text-green-700 dark:text-green-300 mt-2">
                                    <p className="font-medium mb-2">
                                        Parabéns! Você completou uma sessão de foco para:
                                    </p>
                                    <p className="font-semibold text-green-800 dark:text-green-200">
                                        "{task.title}"
                                    </p>
                                    <p className="text-sm mt-3 mb-4">
                                        O que você gostaria de fazer agora?
                                    </p>
                                </AlertDescription>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-200 dark:hover:bg-green-900"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        <Button
                            onClick={onMarkDone}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Marcar como Concluída
                        </Button>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                onClick={onResetTimer}
                                variant="outline"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950"
                            >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Resetar Timer
                            </Button>
                            <Button
                                onClick={onMoveToTodo}
                                variant="outline"
                                className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-950"
                            >
                                <Clock className="h-4 w-4 mr-1" />
                                Mais Tarde
                            </Button>
                        </div>
                    </div>
                </Alert>
            </div>
        </div>
    );
}
