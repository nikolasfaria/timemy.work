import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Timer
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task, TaskStatus } from '@/types/task';
import { usePomodoro } from '@/hooks/usePomodoro';
import { MarkdownRenderer } from './MarkdownRenderer';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
}

export function TaskCard({ task, onUpdateTask, onMoveTask }: TaskCardProps) {
  const { session, startTimer, pauseTimer, stopTimer, formatTime } = usePomodoro();
  const [showChecklist, setShowChecklist] = useState(false);
  
  const isMyTimer = session?.taskId === task.id;
  const completedItems = task.checklist.filter(item => item.completed).length;
  const totalItems = task.checklist.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  const canMarkDone = totalItems === 0 || completedItems === totalItems;

  const handlePomodoroStart = (duration: number) => {
    if (isMyTimer && session?.isActive) {
      pauseTimer();
    } else {
      startTimer(task.id, duration);
    }
  };

  const handleToggleChecklist = (itemId: string) => {
    const updatedChecklist = task.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateTask(task.id, { checklist: updatedChecklist });
  };

  const handleMarkDone = () => {
    if (canMarkDone) {
      onMoveTask(task.id, 'done');
    }
  };

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

  return (
    <Card className="w-full shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm leading-tight">{task.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">#{task.id}</p>
          </div>
          <div className="flex items-center gap-1">
            <Badge 
              variant="secondary" 
              className={cn("text-xs px-2 py-0.5", getEffortColor(task.effort))}
            >
              {task.effort}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover">
                <DropdownMenuItem onClick={() => onMoveTask(task.id, 'todo')}>
                  Move to To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMoveTask(task.id, 'progress')}>
                  Move to Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMoveTask(task.id, 'doing')}>
                  Move to Doing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMoveTask(task.id, 'done')}>
                  Move to Done
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Description */}
        {task.description && (
          <MarkdownRenderer 
            content={task.description} 
            className="line-clamp-3"
          />
        )}

        {/* Progress */}
        {totalItems > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedItems}/{totalItems}</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
        )}

        {/* Checklist Toggle */}
        {totalItems > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChecklist(!showChecklist)}
            className="h-6 text-xs p-0 justify-start"
          >
            {showChecklist ? <Circle className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
            {showChecklist ? 'Hide' : 'Show'} Checklist
          </Button>
        )}

        {/* Checklist Items */}
        {showChecklist && (
          <div className="space-y-1 pl-2">
            {task.checklist.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleChecklist(item.id)}
                  className="h-3 w-3"
                />
                <span className={cn(
                  "text-xs flex-1",
                  item.completed && "line-through text-muted-foreground"
                )}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pomodoro Timer */}
        <div className="flex items-center justify-between pt-2 border-t">
          {isMyTimer && session ? (
            <div className="flex items-center gap-2">
              <Timer className="h-3 w-3" />
              <span className="text-xs font-mono">
                {formatTime(session.remainingTime)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={pauseTimer}
                className="h-6 w-6 p-0"
              >
                {session.isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={stopTimer}
                className="h-6 w-6 p-0"
              >
                <Square className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <Play className="h-3 w-3 mr-1" />
                  <span className="text-xs">Pomodoro</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover">
                <DropdownMenuItem onClick={() => handlePomodoroStart(30)}>
                  <Clock className="h-3 w-3 mr-2" />
                  30 minutes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePomodoroStart(60)}>
                  <Clock className="h-3 w-3 mr-2" />
                  60 minutes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePomodoroStart(90)}>
                  <Clock className="h-3 w-3 mr-2" />
                  90 minutes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePomodoroStart(120)}>
                  <Clock className="h-3 w-3 mr-2" />
                  120 minutes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mark Done Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkDone}
            disabled={!canMarkDone}
            className="h-6 px-2"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            <span className="text-xs">Done</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}