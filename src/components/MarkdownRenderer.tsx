import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn(
      "prose prose-sm max-w-none text-xs",
      "prose-headings:text-foreground prose-p:text-muted-foreground",
      "prose-strong:text-foreground prose-code:text-foreground",
      "prose-pre:bg-muted prose-pre:text-foreground",
      "prose-blockquote:text-muted-foreground prose-blockquote:border-border",
      className
    )}>
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
}