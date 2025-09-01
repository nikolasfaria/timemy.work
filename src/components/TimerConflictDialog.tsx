import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/I18nContext';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Timer, AlertTriangle } from 'lucide-react';

interface TimerConflictDialogProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onMoveToRow: () => void;
    readonly onMoveToTodo: () => void;
    readonly currentTaskTitle: string;
    readonly newTaskTitle: string;
}



export function TimerConflictDialog({
    isOpen,
    onClose,
    onMoveToRow,
    onMoveToTodo,
    currentTaskTitle,
    newTaskTitle
}: TimerConflictDialogProps) {
    const { t } = useTranslation();

    // Seleciona uma mensagem aleatória apenas quando o diálogo abre
    const randomMessage = useMemo(() => {
        const messages = t.dialogs.timerConflictMessages;
        return messages[Math.floor(Math.random() * messages.length)];
    }, [isOpen, t.dialogs.timerConflictMessages]); // Só recalcula quando isOpen muda

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20">
                            <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <AlertDialogTitle className="text-xl font-bold text-left">
                                {t.dialogs.timerConflictTitle}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-base font-medium text-muted-foreground text-left">
                                {t.dialogs.timerConflictSubtitle}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>

                <div className="space-y-4">
                    <AlertDialogDescription className="text-sm leading-relaxed">
                        {randomMessage}
                    </AlertDialogDescription>

                    <AlertDialogDescription className="text-sm leading-relaxed">
                        {t.dialogs.timerConflictDescription}
                    </AlertDialogDescription>

                    <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Timer className="h-4 w-4" />
                            <span>{t.dialogs.timerConflictDescription}</span>
                        </div>
                    </div>
                </div>

                <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 sm:flex-none order-3 sm:order-1"
                    >
                        {t.common.cancel}
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={onMoveToRow}
                        className="flex-1 sm:flex-none order-2"
                    >
                        {t.dialogs.moveToProgress}
                    </Button>

                    <Button
                        onClick={onMoveToTodo}
                        className="flex-1 sm:flex-none order-1 sm:order-3"
                    >
                        {t.dialogs.moveToTodo}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
