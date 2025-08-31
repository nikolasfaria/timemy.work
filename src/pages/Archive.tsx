import { Task } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Timer, ArrowLeft, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Archive = () => {
    const [tasks] = useLocalStorage<Task[]>('timemywork-tasks', []);

    // Filter only archived tasks
    const archivedTasks = tasks.filter(task => task.status === 'archived');

    // Sort by completion date (most recent first)
    const sortedArchivedTasks = archivedTasks.toSorted((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const getEffortColor = (effort: string) => {
        const colors = {
            XS: 'bg-effort-xs',
            S: 'bg-effort-s',
            M: 'bg-effort-m',
            L: 'bg-effort-l',
            XL: 'bg-effort-xl'
        };
        return colors[effort as keyof typeof colors] || 'bg-muted';
    };

    const getComplexityColor = (complexity: string) => {
        const colors = {
            Easy: 'bg-complexity-easy',
            Medium: 'bg-complexity-medium',
            Hard: 'bg-complexity-hard'
        };
        return colors[complexity as keyof typeof colors] || 'bg-muted';
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
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <Link to="/">
                            <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 touch-manipulation">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Voltar</span>
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2 min-w-0">
                            <Timer className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                            <h1 className="text-lg sm:text-2xl font-bold truncate">Arquivo</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                            {archivedTasks.length} tarefa{archivedTasks.length !== 1 ? 's' : ''} arquivada{archivedTasks.length !== 1 ? 's' : ''}
                        </span>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-4 sm:py-6">
                {archivedTasks.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                        <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-lg sm:text-xl font-semibold mb-2">Nenhuma tarefa arquivada</h2>
                        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
                            Tarefas concluídas aparecerão aqui automaticamente
                        </p>
                        <Link to="/">
                            <Button className="h-10 sm:h-11 px-6 touch-manipulation">
                                Voltar ao Kanban
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <h2 className="text-base sm:text-lg font-semibold">Tarefas Concluídas</h2>
                        </div>

                        <div className="grid gap-3 sm:gap-4">
                            {sortedArchivedTasks.map((task) => {
                                const completedItems = task.checklist.filter(item => item.completed).length;
                                const totalItems = task.checklist.length;

                                return (
                                    <Card key={task.id} className="w-full shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-200 rounded-xl hover:scale-[1.01] touch-manipulation">
                                        <CardHeader className="pb-3 sm:pb-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-sm sm:text-base font-semibold line-clamp-2 mb-2 leading-tight">
                                                        {task.title}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                        <span className="truncate">Concluída em {formatDate(task.updatedAt)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn("text-xs px-2 py-1 font-medium rounded-md", getEffortColor(task.effort))}
                                                    >
                                                        {task.effort}
                                                    </Badge>
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn("text-xs px-2 py-1 font-medium rounded-md", getComplexityColor(task.complexity))}
                                                    >
                                                        {task.complexity}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-0 space-y-3 sm:space-y-4">
                                            {/* Description */}
                                            {task.description && (
                                                <MarkdownRenderer
                                                    content={task.description}
                                                    className="line-clamp-3 text-xs sm:text-sm leading-relaxed"
                                                />
                                            )}

                                            {/* Checklist Summary */}
                                            {totalItems > 0 && (
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                    <span className="font-medium">{completedItems}/{totalItems} itens concluídos</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archive;
