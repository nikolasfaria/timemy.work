import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  readonly content: string;
  readonly className?: string;
}

// Custom components for markdown rendering
const MarkdownTable = ({ children, ...props }: { readonly children: React.ReactNode; readonly [key: string]: any }) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full border-collapse border border-border rounded-md" {...props}>
      {children}
    </table>
  </div>
);

const MarkdownTh = ({ children, ...props }: { readonly children: React.ReactNode; readonly [key: string]: any }) => (
  <th className="border border-border bg-muted px-3 py-2 text-left font-medium" {...props}>
    {children}
  </th>
);

const MarkdownTd = ({ children, ...props }: { readonly children: React.ReactNode; readonly [key: string]: any }) => (
  <td className="border border-border px-3 py-2" {...props}>
    {children}
  </td>
);

const MarkdownCode = ({ children, className, ...props }: { readonly children: React.ReactNode; readonly className?: string; readonly [key: string]: any }) => {
  const isInline = !className;
  return isInline ? (
    <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

// Custom heading components with proper styling
const MarkdownH1 = ({ children, ...props }: { readonly children: React.ReactNode; readonly [key: string]: any }) => (
  <h1 className="text-2xl font-bold text-foreground mt-6 mb-4 first:mt-0" {...props}>
    {children}
  </h1>
);

const MarkdownH2 = ({ children, ...props }: { readonly children: React.ReactNode; readonly [key: string]: any }) => (
  <h2 className="text-xl font-semibold text-foreground mt-5 mb-3 first:mt-0" {...props}>
    {children}
  </h2>
);

const MarkdownH3 = ({ children, ...props }: { readonly children: React.ReactNode; readonly [key: string]: any }) => (
  <h3 className="text-lg font-medium text-foreground mt-4 mb-2 first:mt-0" {...props}>
    {children}
  </h3>
);

const MarkdownH4 = ({ children, ...props }: { readonly children: React.ReactNode; readonly [key: string]: any }) => (
  <h4 className="text-base font-medium text-foreground mt-3 mb-2 first:mt-0" {...props}>
    {children}
  </h4>
);

const MarkdownH5 = ({ children, ...props }: { readonly children: React.ReactNode; readonly [key: string]: any }) => (
  <h5 className="text-sm font-medium text-foreground mt-3 mb-1 first:mt-0" {...props}>
    {children}
  </h5>
);

const MarkdownH6 = ({ children, ...props }: { readonly children: React.ReactNode; readonly [key: string]: any }) => (
  <h6 className="text-sm font-medium text-muted-foreground mt-2 mb-1 first:mt-0" {...props}>
    {children}
  </h6>
);

const markdownComponents = {
  table: MarkdownTable,
  th: MarkdownTh,
  td: MarkdownTd,
  code: MarkdownCode,
  h1: MarkdownH1,
  h2: MarkdownH2,
  h3: MarkdownH3,
  h4: MarkdownH4,
  h5: MarkdownH5,
  h6: MarkdownH6,
};

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn(
      "prose max-w-none",
      "prose-p:text-foreground prose-p:leading-relaxed",
      "prose-strong:text-foreground prose-em:text-foreground",
      "prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-md prose-pre:p-3",
      "prose-blockquote:text-muted-foreground prose-blockquote:border-border prose-blockquote:border-l-4 prose-blockquote:pl-4",
      "prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-li:my-1",
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      "prose-hr:border-border",
      "dark:prose-invert",
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}