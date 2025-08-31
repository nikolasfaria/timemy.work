import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
}

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-kanban-todo' },
  { id: 'progress', title: 'Row', color: 'bg-kanban-progress' },
  { id: 'doing', title: 'Doing', color: 'bg-kanban-doing' },
  { id: 'done', title: 'Done', color: 'bg-kanban-done' },
] as const;

export function KanbanBoard({ tasks, onUpdateTask, onMoveTask }: KanbanBoardProps) {
  const getTasksForColumn = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {COLUMNS.map((column) => {
        const columnTasks = getTasksForColumn(column.id as TaskStatus);

        return (
          <div key={column.id} className="flex flex-col">
            <Card className="flex-1 min-h-[600px]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {column.title}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={cn("text-white", column.color)}
                  >
                    {columnTasks.length}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateTask={onUpdateTask}
                      onMoveTask={onMoveTask}
                    />
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Nenhuma tarefa</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}