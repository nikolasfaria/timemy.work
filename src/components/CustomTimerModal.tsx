import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/I18nContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Clock } from 'lucide-react';

interface CustomTimerModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onConfirm: (minutes: number) => void;
    readonly taskTitle: string;
}

export function CustomTimerModal({ isOpen, onClose, onConfirm, taskTitle }: CustomTimerModalProps) {
    const { t } = useTranslation();
    const [minutes, setMinutes] = useState('');
    const [error, setError] = useState('');

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setMinutes('');
            setError('');
        }
    }, [isOpen]);

    const handleMinutesChange = (value: string) => {
        setMinutes(value);
        setError('');

        // Validate input
        const num = parseInt(value);
        if (value && (isNaN(num) || num < 1 || num > 999)) {
            setError('Digite um número entre 1 e 999'); // Keep hardcoded for now
        }
    };

    const handleConfirm = () => {
        const num = parseInt(minutes);
        if (num >= 1 && num <= 999) {
            onConfirm(num);
            onClose();
        } else {
            setError('Digite um número entre 1 e 999'); // Keep hardcoded for now
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !error && minutes) {
            handleConfirm();
        }
    };

    const isValid = minutes && !error && parseInt(minutes) >= 1 && parseInt(minutes) <= 999;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        {t.dialogs.customTimerTitle}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Defina um tempo personalizado para a tarefa "{taskTitle}"
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="custom-minutes" className="text-sm font-medium">
                            {t.dialogs.customTimerLabel}
                        </Label>
                        <Input
                            id="custom-minutes"
                            type="number"
                            min="1"
                            max="999"
                            value={minutes}
                            onChange={(e) => handleMinutesChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t.dialogs.customTimerPlaceholder}
                            className={error ? "border-destructive focus-visible:ring-destructive" : ""}
                            autoFocus
                        />
                        {error && (
                            <p className="text-xs text-destructive">{error}</p>
                        )}
                    </div>

                    {/* Quick suggestions */}
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Sugestões rápidas:</Label>
                        <div className="flex gap-2 flex-wrap">
                            {[25, 45, 90].map((suggestion) => (
                                <Button
                                    key={suggestion}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMinutesChange(suggestion.toString())}
                                    className="h-8 px-3 text-xs"
                                >
                                    {suggestion}min
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 sm:flex-none"
                    >
                        {t.common.cancel}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!isValid}
                        className="flex-1 sm:flex-none"
                    >
                        {t.task.startTimer}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
