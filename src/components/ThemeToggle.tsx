import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
    readonly variant?: 'default' | 'ghost' | 'outline';
    readonly size?: 'default' | 'sm' | 'lg';
    readonly className?: string;
}

export function ThemeToggle({ variant = 'ghost', size = 'sm', className }: ThemeToggleProps) {
    const { theme, setTheme, currentTheme } = useTheme();

    const getIcon = () => {
        if (theme === 'system') {
            return <Monitor className="h-4 w-4" />;
        }
        return currentTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
    };

    const getLabel = () => {
        if (theme === 'system') return 'Sistema';
        return currentTheme === 'dark' ? 'Escuro' : 'Claro';
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    className={className}
                    aria-label={`Tema atual: ${getLabel()}. Clique para alterar tema.`}
                >
                    {getIcon()}
                    <span className="sr-only">Alternar tema</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Claro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Escuro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>Sistema</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
