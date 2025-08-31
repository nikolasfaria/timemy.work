import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarkdownEditor } from './MarkdownEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { Task, Effort, Complexity, ChecklistItem } from '@/types/task';

interface CreateTaskDialogProps {
  readonly onCreateTask: (task: Omit<Task, 'createdAt' | 'updatedAt'>) => void;
  readonly existingIds: number[];
}

export function CreateTaskDialog({ onCreateTask, existingIds }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [description, setDescription] = useState('');
  const [effort, setEffort] = useState<Effort>('M');
  const [complexity, setComplexity] = useState<Complexity>('Medium');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false,
      };
      setChecklist([...checklist, newItem]);
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    setChecklist(checklist.filter(item => item.id !== itemId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskId = parseInt(id);
    if (!title.trim() || !id.trim() || isNaN(taskId)) return;

    if (existingIds.includes(taskId)) {
      alert('ID já existe. Por favor, escolha um ID diferente.');
      return;
    }

    const newTask: Omit<Task, 'createdAt' | 'updatedAt'> = {
      id: taskId,
      title: title.trim(),
      description: description.trim(),
      checklist,
      effort,
      complexity,
      status: 'todo',
    };

    onCreateTask(newTask);

    // Reset form
    setTitle('');
    setId('');
    setDescription('');
    setEffort('M');
    setComplexity('Medium');
    setChecklist([]);
    setNewChecklistItem('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Criar Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome da tarefa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id">ID *</Label>
              <Input
                id="id"
                type="number"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="1234"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <MarkdownEditor
              value={description}
              onChange={setDescription}
              placeholder="Descrição detalhada da tarefa (suporte a markdown)"
              expandable={true}
              minHeight={100}
              maxHeight={300}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Esforço</Label>
              <Select value={effort} onValueChange={(value: Effort) => setEffort(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS - Muito Pequeno</SelectItem>
                  <SelectItem value="S">S - Pequeno</SelectItem>
                  <SelectItem value="M">M - Médio</SelectItem>
                  <SelectItem value="L">L - Grande</SelectItem>
                  <SelectItem value="XL">XL - Muito Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Complexidade</Label>
              <Select value={complexity} onValueChange={(value: Complexity) => setComplexity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Fácil</SelectItem>
                  <SelectItem value="Medium">Médio</SelectItem>
                  <SelectItem value="Hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Checklist</Label>
            <div className="flex gap-2">
              <Input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Adicionar item ao checklist"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
              />
              <Button type="button" onClick={handleAddChecklistItem} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {checklist.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                    <span>{item.text}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}