import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    Trash2
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!task) return null;
    const completedItems = task.checklist?.filter(item => item.completed).length || 0;
    const totalItems = task.checklist?.length || 0;
    const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    const canMarkDone = totalItems === 0 || completedItems === totalItems;

    const handleToggleChecklist = (itemId: string) => {
        const updatedChecklist = task.checklist?.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        ) || [];
        onUpdateTask(task.id, { checklist: updatedChecklist });
    };

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
            progress: 'Row',
            doing: 'Doing',
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
                            <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
                            <div className="prose prose-sm max-w-none">
                                <MarkdownRenderer content={task.description} />
                            </div>
                        </div>
                    )}



                    {/* Checklist */}
                    {task.checklist && task.checklist.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Checklist ({completedItems}/{totalItems})
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
                                            onCheckedChange={() => handleToggleChecklist(item.id)}
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
