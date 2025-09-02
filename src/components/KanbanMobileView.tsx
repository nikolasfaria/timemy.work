import React, { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Badge } from './ui/badge';
import { useTranslation } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import {
    FileText,
    Play,
    Clock,
    CheckCircle2,
    Plus
} from 'lucide-react';

interface KanbanMobileViewProps {
    tasks: Task[];
    onUpdateTask: (id: number, updates: Partial<Task>) => void;
    onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
    onDeleteTask: (taskId: number) => void;
    onViewDetails: (task: Task) => void;
    onCreateTask: () => void;
}

const COLUMN_CONFIG = [
    {
        id: 'todo',
        icon: FileText,
        color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
        id: 'doing',
        icon: Play,
        color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
    },
    {
        id: 'progress',
        icon: Clock,
        color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
        id: 'done',
        icon: CheckCircle2,
        color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
] as const;

export const KanbanMobileView: React.FC<KanbanMobileViewProps> = ({
    tasks,
    onUpdateTask,
    onMoveTask,
    onDeleteTask,
    onViewDetails,
    onCreateTask,
}) => {
    const { t } = useTranslation();
    const [activeColumn, setActiveColumn] = useState<TaskStatus>('todo');

    // Obter tarefas da coluna ativa
    const getActiveColumnTasks = () => {
        return tasks
            .filter(task => task.status === activeColumn)
            .sort((a, b) => {
                const orderA = a.order || 0;
                const orderB = b.order || 0;
                if (orderA === orderB) {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                }
                return orderA - orderB;
            });
    };

    // Obter configuração da coluna ativa
    const getActiveColumnConfig = () => {
        return COLUMN_CONFIG.find(col => col.id === activeColumn);
    };

    // Obter tradução do título da coluna
    const getColumnTitle = (status: TaskStatus) => {
        const titleMap = {
            todo: t.kanban.columns.todo,
            doing: t.kanban.columns.doing, // ROW
            progress: t.kanban.columns.progress, // IN PROGRESS  
            done: t.kanban.columns.done,
        };
        return titleMap[status] || status;
    };

    // Contar tarefas por coluna
    const getTaskCount = (status: TaskStatus) => {
        return tasks.filter(task => task.status === status).length;
    };

    const activeColumnTasks = getActiveColumnTasks();
    const activeColumnConfig = getActiveColumnConfig();
    const Icon = activeColumnConfig?.icon || FileText;

    return (
        <div className="flex h-full flex-col pb-20 px-4">
            {/* Header da coluna ativa */}
            <div className="mb-6 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", activeColumnConfig?.color)}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            {getColumnTitle(activeColumn)}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {activeColumnTasks.length} {activeColumnTasks.length === 1 ? t.common.task : t.common.tasks}
                        </p>
                    </div>
                </div>

                {/* Botão de criar tarefa */}
                <button
                    onClick={onCreateTask}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            {/* Container de conteúdo */}
            <div className="flex-1 overflow-y-auto pb-4">
                {/* Lista de tarefas */}
                <div className="space-y-4">
                    {activeColumnTasks.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted p-8 text-center mx-2 mt-8">
                            <Icon className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">
                                {t.kanban.noTasks}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground/70 px-4">
                                {t.nav.createFirstTask}
                            </p>
                        </div>
                    ) : (
                        activeColumnTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                allTasks={tasks}
                                onUpdateTask={onUpdateTask}
                                onMoveTask={onMoveTask}
                                onDeleteTask={onDeleteTask}
                                onViewDetails={onViewDetails}
                                isMobile={true}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Tabs de navegação */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t">
                <div className="flex px-2 py-1">
                    {COLUMN_CONFIG.map((column) => {
                        const ColumnIcon = column.icon;
                        const taskCount = getTaskCount(column.id as TaskStatus);
                        const isActive = activeColumn === column.id;

                        return (
                            <button
                                key={column.id}
                                onClick={() => setActiveColumn(column.id as TaskStatus)}
                                className={cn(
                                    "flex-1 flex flex-col items-center gap-1 py-3 px-3 mx-1 rounded-lg transition-colors",
                                    isActive
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                )}
                            >
                                <div className="relative">
                                    <ColumnIcon className="h-5 w-5" />
                                    {taskCount > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="absolute -top-2 -right-2 h-4 w-4 text-xs p-0 flex items-center justify-center min-w-0"
                                        >
                                            {taskCount}
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-xs font-medium truncate max-w-full">
                                    {getColumnTitle(column.id as TaskStatus)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>


        </div>
    );
};
