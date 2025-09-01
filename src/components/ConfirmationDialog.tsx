import { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/contexts/I18nContext';

interface ConfirmationDialogProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onConfirm: () => void;
    readonly title?: string;
    readonly description?: string;
    readonly type?: 'default' | 'markDone' | 'delete';
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    type = 'default'
}: ConfirmationDialogProps) {
    const { t } = useTranslation();
    const [currentMessage, setCurrentMessage] = useState('');

    // Get random fun message for mark done confirmation
    useEffect(() => {
        if (isOpen && type === 'markDone') {
            const messages = t.dialogs.markDoneMessages;
            const randomIndex = Math.floor(Math.random() * messages.length);
            setCurrentMessage(messages[randomIndex]);
        }
    }, [isOpen, type, t.dialogs.markDoneMessages]);

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    // Get title and description based on type
    const getTitle = () => {
        if (title) return title;
        if (type === 'markDone') return t.dialogs.markDoneTitle;
        if (type === 'delete') return t.dialogs.deleteTaskTitle;
        return t.common.confirm;
    };

    const getDescription = () => {
        if (description) return description;
        if (type === 'markDone') return t.dialogs.markDoneDescription;
        if (type === 'delete') return t.dialogs.deleteTaskDescription;
        return '';
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent
                className="sm:max-w-md"
                role="alertdialog"
                aria-labelledby="confirmation-title"
                aria-describedby="confirmation-description"
            >
                <AlertDialogHeader>
                    <AlertDialogTitle
                        id="confirmation-title"
                        className="text-lg font-semibold"
                    >
                        {getTitle()}
                    </AlertDialogTitle>

                    {/* Fun message for mark done */}
                    {type === 'markDone' && currentMessage && (
                        <output
                            className="text-base font-medium text-foreground bg-muted/50 p-3 rounded-md border-l-4 border-primary"
                            aria-live="polite"
                        >
                            {currentMessage}
                        </output>
                    )}

                    <AlertDialogDescription
                        id="confirmation-description"
                        className="text-sm text-muted-foreground"
                    >
                        {getDescription()}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex gap-2 sm:gap-2">
                    <AlertDialogCancel
                        onClick={handleCancel}
                        className="flex-1 sm:flex-none"
                        aria-label={`${t.common.cancel} - Não executar a ação`}
                    >
                        {t.common.cancel}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={`flex-1 sm:flex-none ${type === 'delete'
                            ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                            : 'bg-primary hover:bg-primary/90'
                            }`}
                        aria-label={`${t.common.confirm} - Executar a ação`}
                    >
                        {(() => {
                            if (type === 'markDone') return t.common.yes;
                            if (type === 'delete') return t.common.delete;
                            return t.common.confirm;
                        })()}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
