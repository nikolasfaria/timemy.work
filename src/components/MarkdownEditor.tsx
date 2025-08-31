import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly placeholder?: string;
    readonly className?: string;
    readonly expandable?: boolean;
    readonly minHeight?: number;
    readonly maxHeight?: number;
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder = "Digite sua descrição...",
    className,
    expandable = false,
    minHeight = 100,
    maxHeight = 400
}: MarkdownEditorProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Auto-expand when typing
    useEffect(() => {
        if (value && value.length > 100 && !isExpanded && expandable) {
            setIsExpanded(true);
        }
    }, [value, isExpanded, expandable]);

    const currentHeight = isExpanded ? maxHeight : minHeight;

    return (
        <div className={cn("relative", className)}>
            <div className="relative">
                <MDEditor
                    value={value}
                    onChange={(val) => onChange(val || '')}
                    preview="edit"
                    hideToolbar={!isFocused && !isExpanded}
                    visibleDragBar={false}
                    textareaProps={{
                        placeholder,
                        style: {
                            fontSize: '14px',
                            lineHeight: '1.5',
                            fontFamily: 'inherit',
                            resize: 'none',
                            minHeight: `${currentHeight}px`,
                            maxHeight: `${maxHeight}px`,
                        },
                        onFocus: () => setIsFocused(true),
                        onBlur: () => setIsFocused(false),
                    }}
                    height={currentHeight}
                    data-color-mode="light"
                    className={cn(
                        "!border-input transition-all duration-200",
                        isFocused && "!border-primary !ring-2 !ring-primary/20",
                        "markdown-editor"
                    )}
                />

                {/* Expand/Collapse Button */}
                {expandable && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-60 hover:opacity-100 z-10"
                        aria-label={isExpanded ? "Minimizar editor" : "Expandir editor"}
                    >
                        {isExpanded ? (
                            <Minimize2 className="h-3 w-3" />
                        ) : (
                            <Maximize2 className="h-3 w-3" />
                        )}
                    </Button>
                )}
            </div>

            {/* Helper text */}
            {(isFocused || value) && (
                <p className="text-xs text-muted-foreground mt-1 transition-opacity duration-200">
                    Suporte a Markdown: **negrito**, *itálico*, `código`, [links](url), etc.
                </p>
            )}
        </div>
    );
}

// CSS customizations for the markdown editor
export const markdownEditorStyles = `
  .markdown-editor .w-md-editor {
    background-color: transparent !important;
  }
  
  .markdown-editor .w-md-editor-text-pre, 
  .markdown-editor .w-md-editor-text-input, 
  .markdown-editor .w-md-editor-text {
    color: hsl(var(--foreground)) !important;
    background-color: transparent !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
  }
  
  .markdown-editor .w-md-editor-text-pre .token.title {
    color: hsl(var(--primary)) !important;
  }
  
  .markdown-editor .w-md-editor-text-pre .token.bold {
    color: hsl(var(--foreground)) !important;
    font-weight: 600 !important;
  }
  
  .markdown-editor .w-md-editor-text-pre .token.code {
    color: hsl(var(--muted-foreground)) !important;
    background-color: hsl(var(--muted)) !important;
    padding: 2px 4px !important;
    border-radius: 3px !important;
  }
  
  .markdown-editor .w-md-editor-text-pre .token.url {
    color: hsl(var(--primary)) !important;
  }
  
  .markdown-editor .w-md-editor-toolbar {
    background-color: hsl(var(--background)) !important;
    border-bottom: 1px solid hsl(var(--border)) !important;
  }
  
  .markdown-editor .w-md-editor-toolbar-divider {
    background-color: hsl(var(--border)) !important;
  }
  
  .markdown-editor .w-md-editor-toolbar button {
    color: hsl(var(--muted-foreground)) !important;
  }
  
  .markdown-editor .w-md-editor-toolbar button:hover {
    color: hsl(var(--foreground)) !important;
    background-color: hsl(var(--muted)) !important;
  }
`;
