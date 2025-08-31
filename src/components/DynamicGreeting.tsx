import { useDateTime } from '@/hooks/useDateTime';
import { cn } from '@/lib/utils';

interface DynamicGreetingProps {
    readonly className?: string;
    readonly showOnMobile?: boolean;
}

export function DynamicGreeting({ className, showOnMobile = false }: DynamicGreetingProps) {
    const { greeting, dayOfWeek, dayOfMonth, time } = useDateTime();

    return (
        <div className={cn(
            "flex flex-col gap-1 text-left",
            !showOnMobile && "hidden lg:block", // Só mostra na visão web por padrão
            className
        )}>
            {/* Saudação */}
            <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">
                    {greeting}
                </span>
            </div>

            {/* Data e Horário */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="font-medium">{dayOfWeek}</span>
                    <span className="text-xs">•</span>
                    <span>{dayOfMonth}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs hidden sm:inline">•</span>
                    <span className="font-mono font-medium text-primary tabular-nums dynamic-greeting-time">
                        {time}
                    </span>
                </div>
            </div>
        </div>
    );
}

// Versão compacta para mobile
export function CompactGreeting({ className }: { readonly className?: string }) {
    const { greeting, time } = useDateTime();

    return (
        <div className={cn("flex items-center gap-2 lg:hidden", className)}>
            <span className="text-sm font-medium text-foreground">
                {greeting.split(' ')[0]} {/* Só o "Olá", "Bom dia", etc. */}
            </span>
            <span className="text-xs font-mono text-primary tabular-nums dynamic-greeting-time">
                {time.slice(0, 5)} {/* Só HH:MM */}
            </span>
        </div>
    );
}

// Componente para data e horário centralizado no navbar
export function CenteredDateTime({ className }: { readonly className?: string }) {
    const { dayOfWeek, dayOfMonth, time } = useDateTime();

    return (
        <div className={cn("flex items-center justify-center gap-3 text-sm text-foreground", className)}>
            <span className="font-medium">{dayOfWeek}</span>
            <span className="text-xs">•</span>
            <span className="font-medium">{dayOfMonth}</span>
            <span className="text-xs">•</span>
            <span className="font-mono font-medium tabular-nums dynamic-greeting-time">
                {time}
            </span>
        </div>
    );
}
