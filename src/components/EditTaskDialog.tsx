import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/I18nContext';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Edit3 } from 'lucide-react';
import { Task } from '@/types/task';

interface EditTaskDialogProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onSave: (updates: Partial<Task>) => void;
    readonly task: Task;
}

export function EditTaskDialog({ isOpen, onClose, onSave, task }: EditTaskDialogProps) {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [effort, setEffort] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');
    const [checklist, setChecklist] = useState<Array<{ id: string; text: string; completed: boolean }>>([]);
    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [pipefyUrl, setPipefyUrl] = useState('');
    const [notionUrl, setNotionUrl] = useState('');

    // Reset form when task changes or dialog opens
    useEffect(() => {
        if (isOpen && task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setEffort(task.effort);
            setChecklist(task.checklist || []);
            setNewChecklistItem('');
            setGithubUrl(task.githubUrl || '');
            setPipefyUrl(task.pipefyUrl || '');
            setNotionUrl(task.notionUrl || '');
        }
    }, [isOpen, task]);

    const handleAddChecklistItem = () => {
        if (newChecklistItem.trim()) {
            const newItem = {
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

    const handleToggleChecklistItem = (itemId: string) => {
        setChecklist(checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        ));
    };

    const handleSave = () => {
        if (!title.trim()) return;

        const updates: Partial<Task> = {
            title: title.trim(),
            description: description.trim() || undefined,
            effort,
            checklist: checklist.length > 0 ? checklist : [],
            githubUrl: githubUrl.trim() || undefined,
            pipefyUrl: pipefyUrl.trim() || undefined,
            notionUrl: notionUrl.trim() || undefined,
        };

        onSave(updates);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSave();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit3 className="h-5 w-5 text-primary" />
                        {t.dialogs.editTaskTitle}
                    </DialogTitle>
                    <DialogDescription>
                        Faça as alterações necessárias na tarefa abaixo.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4 py-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Título *</Label>
                        <Input
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Digite o título da tarefa"
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Descrição</Label>
                        <MarkdownEditor
                            value={description}
                            onChange={setDescription}
                            placeholder="Descreva a tarefa (opcional)"
                            expandable={true}
                            minHeight={120}
                            maxHeight={250}
                        />
                    </div>

                    {/* Effort */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-effort">Tamanho</Label>
                        <Select value={effort} onValueChange={(value: any) => setEffort(value)}>
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

                    {/* Checklist */}
                    <div className="space-y-2">
                        <Label>Checklist</Label>

                        {/* Add new item */}
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
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddChecklistItem}
                                disabled={!newChecklistItem.trim()}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Existing items */}
                        {checklist.length > 0 && (
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {checklist.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2 p-2 border rounded-lg">
                                        <Checkbox
                                            checked={item.completed}
                                            onCheckedChange={() => handleToggleChecklistItem(item.id)}
                                        />
                                        <label className={`flex-1 text-sm cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                            {item.text}
                                        </label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveChecklistItem(item.id)}
                                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                            aria-label={`Remover item: ${item.text}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Links Externos */}
                    <div className="space-y-4 pt-4 border-t">
                        <Label className="text-sm font-medium text-muted-foreground">Links Externos</Label>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="edit-github-url" className="text-xs text-muted-foreground">GitHub</Label>
                                <Input
                                    id="edit-github-url"
                                    type="url"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    placeholder="https://github.com/usuario/repositorio"
                                    className="text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit-pipefy-url" className="text-xs text-muted-foreground">Pipefy</Label>
                                <Input
                                    id="edit-pipefy-url"
                                    type="url"
                                    value={pipefyUrl}
                                    onChange={(e) => setPipefyUrl(e.target.value)}
                                    placeholder="https://app.pipefy.com/pipes/..."
                                    className="text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit-notion-url" className="text-xs text-muted-foreground">Notion</Label>
                                <Input
                                    id="edit-notion-url"
                                    type="url"
                                    value={notionUrl}
                                    onChange={(e) => setNotionUrl(e.target.value)}
                                    placeholder="https://notion.so/..."
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter className="flex gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 sm:flex-none"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!title.trim()}
                        className="flex-1 sm:flex-none"
                    >
                        Salvar Alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
