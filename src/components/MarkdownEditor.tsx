import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

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
  const { currentTheme } = useTheme();

  // Auto-expand when typing
  useEffect(() => {
    if (value && value.length > 100 && !isExpanded && expandable) {
      setIsExpanded(true);
    }
  }, [value, isExpanded, expandable]);

  // Force text color on theme change
  useEffect(() => {
    const applyColors = () => {
      // More specific selectors targeting the exact elements
      const selectors = [
        '.markdown-editor textarea',
        '.markdown-editor .w-md-editor-text-input',
        'textarea.w-md-editor-text-input',
        '.w-md-editor-text-input',
        '.w-md-editor textarea',
        '.w-md-editor-area textarea'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (element instanceof HTMLTextAreaElement) {
            const isDark = document.documentElement.classList.contains('dark');

            // Remove any existing style first
            element.style.removeProperty('color');
            element.style.removeProperty('background-color');

            // Force apply new styles
            if (isDark) {
              element.style.setProperty('color', 'white', 'important');
              element.style.setProperty('background-color', '#09090b', 'important');
              element.style.setProperty('-webkit-text-fill-color', 'white', 'important');
            } else {
              element.style.setProperty('color', '#0f172a', 'important');
              element.style.setProperty('background-color', '#ffffff', 'important');
              element.style.setProperty('-webkit-text-fill-color', '#0f172a', 'important');
            }
          }
        });
      });
    };

    // Apply multiple times to ensure it sticks
    applyColors();
    const timeout1 = setTimeout(applyColors, 50);
    const timeout2 = setTimeout(applyColors, 200);
    const timeout3 = setTimeout(applyColors, 500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [currentTheme, isFocused, value]);

  // Observer para aplicar cores em elementos criados dinamicamente
  useEffect(() => {
    const observerCallback = (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const textareas = element.querySelectorAll?.('textarea, .w-md-editor-text-input') || [];
              textareas.forEach((textarea) => {
                if (textarea instanceof HTMLTextAreaElement) {
                  const isDark = document.documentElement.classList.contains('dark');
                  if (isDark) {
                    textarea.style.setProperty('color', 'white', 'important');
                    textarea.style.setProperty('background-color', '#09090b', 'important');
                    textarea.style.setProperty('-webkit-text-fill-color', 'white', 'important');
                  } else {
                    textarea.style.setProperty('color', '#0f172a', 'important');
                    textarea.style.setProperty('background-color', '#ffffff', 'important');
                    textarea.style.setProperty('-webkit-text-fill-color', '#0f172a', 'important');
                  }
                }
              });
            }
          });
        }

        // Watch for attribute changes (style changes)
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement;
          if (target.tagName === 'TEXTAREA' && target.classList.contains('w-md-editor-text-input')) {
            const isDark = document.documentElement.classList.contains('dark');
            if (isDark) {
              target.style.setProperty('color', 'white', 'important');
              target.style.setProperty('-webkit-text-fill-color', 'white', 'important');
            }
          }
        }
      });
    };

    const observer = new MutationObserver(observerCallback);
    const editorContainer = document.querySelector('.markdown-editor');

    if (editorContainer) {
      observer.observe(editorContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
      });
    }

    return () => observer.disconnect();
  }, []);

  // Force color override on every render
  useEffect(() => {
    const forceColors = () => {
      const textareas = document.querySelectorAll('textarea.w-md-editor-text-input');
      textareas.forEach((textarea) => {
        if (textarea instanceof HTMLTextAreaElement) {
          const isDark = document.documentElement.classList.contains('dark');
          if (isDark) {
            textarea.style.setProperty('color', 'white', 'important');
            textarea.style.setProperty('-webkit-text-fill-color', 'white', 'important');
          }
        }
      });
    };

    forceColors();
  });

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
              color: currentTheme === 'dark' ? '#f8fafc' : '#0f172a',
              backgroundColor: currentTheme === 'dark' ? '#09090b' : '#ffffff',
              border: 'none',
            },
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
          }}
          height={currentHeight}
          data-color-mode={currentTheme}
          className={cn(
            "!border-input transition-all duration-200",
            isFocused && "!border-primary !ring-2 !ring-primary/20",
            "markdown-editor",
            isFocused && "focus"
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
  /* Base editor container */
  .markdown-editor .w-md-editor {
    background-color: hsl(var(--background)) !important;
    border: 1px solid hsl(var(--border)) !important;
    border-radius: 8px !important;
  }
  
  /* Text areas and content */
  .markdown-editor .w-md-editor-text-pre, 
  .markdown-editor .w-md-editor-text-input, 
  .markdown-editor .w-md-editor-text {
    color: hsl(var(--foreground)) !important;
    background-color: hsl(var(--background)) !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    border: none !important;
  }
  
  /* Markdown syntax highlighting */
  .markdown-editor .w-md-editor-text-pre .token.title {
    color: hsl(var(--primary)) !important;
  }
  
  .markdown-editor .w-md-editor-text-pre .token.bold {
    color: hsl(var(--foreground)) !important;
    font-weight: 600 !important;
  }
  
  .markdown-editor .w-md-editor-text-pre .token.italic {
    color: hsl(var(--foreground)) !important;
    font-style: italic !important;
  }
  
  .markdown-editor .w-md-editor-text-pre .token.code {
    color: hsl(var(--accent-foreground)) !important;
    background-color: hsl(var(--muted)) !important;
    padding: 2px 4px !important;
    border-radius: 3px !important;
    font-family: ui-monospace, SFMono-Regular, monospace !important;
  }
  
  .markdown-editor .w-md-editor-text-pre .token.url {
    color: hsl(var(--primary)) !important;
    text-decoration: underline !important;
  }
  
  .markdown-editor .w-md-editor-text-pre .token.list {
    color: hsl(var(--muted-foreground)) !important;
  }
  
  .markdown-editor .w-md-editor-text-pre .token.blockquote {
    color: hsl(var(--muted-foreground)) !important;
    border-left: 4px solid hsl(var(--border)) !important;
    padding-left: 12px !important;
  }
  
  /* Toolbar */
  .markdown-editor .w-md-editor-toolbar {
    background-color: hsl(var(--muted/50)) !important;
    border-bottom: 1px solid hsl(var(--border)) !important;
    border-radius: 8px 8px 0 0 !important;
  }
  
  .markdown-editor .w-md-editor-toolbar-divider {
    background-color: hsl(var(--border)) !important;
  }
  
  .markdown-editor .w-md-editor-toolbar button {
    color: hsl(var(--muted-foreground)) !important;
    background-color: transparent !important;
    border: none !important;
    border-radius: 4px !important;
    transition: all 0.2s ease !important;
  }
  
  .markdown-editor .w-md-editor-toolbar button:hover {
    color: hsl(var(--foreground)) !important;
    background-color: hsl(var(--muted)) !important;
  }
  
  .markdown-editor .w-md-editor-toolbar button.active {
    color: hsl(var(--primary)) !important;
    background-color: hsl(var(--primary/10)) !important;
  }
  
  /* Focus states */
  .markdown-editor.focus .w-md-editor {
    border-color: hsl(var(--primary)) !important;
    box-shadow: 0 0 0 2px hsl(var(--primary/20)) !important;
  }
  
  /* Dark mode specific adjustments */
  .dark .markdown-editor .w-md-editor-text-pre .token.code {
    background-color: hsl(var(--muted)) !important;
  }
  
  .dark .markdown-editor .w-md-editor-toolbar {
    background-color: hsl(var(--muted/30)) !important;
  }
`;
