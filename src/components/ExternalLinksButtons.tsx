import { Button } from '@/components/ui/button';
import { SiNotion, SiGithub } from 'react-icons/si';
import { PipefyIcon } from './icons/PipefyIcon';

interface ExternalLinksButtonsProps {
    readonly githubUrl?: string;
    readonly pipefyUrl?: string;
    readonly notionUrl?: string;
    readonly size?: 'sm' | 'xs';
    readonly variant?: 'ghost' | 'outline';
    readonly className?: string;
}

export function ExternalLinksButtons({
    githubUrl,
    pipefyUrl,
    notionUrl,
    size = 'xs',
    variant = 'ghost',
    className = ''
}: ExternalLinksButtonsProps) {
    const handleOpenLink = (url: string, platform: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Se não há nenhuma URL, não renderiza nada
    if (!githubUrl && !pipefyUrl && !notionUrl) {
        return null;
    }

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {githubUrl && (
                <Button
                    variant={variant}
                    size={size}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenLink(githubUrl, 'GitHub');
                    }}
                    className="text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors p-1"
                    aria-label="Abrir no GitHub"
                    title="Abrir no GitHub"
                >
                    <SiGithub className="h-3 w-3" />
                </Button>
            )}

            {pipefyUrl && (
                <Button
                    variant={variant}
                    size={size}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenLink(pipefyUrl, 'Pipefy');
                    }}
                    className="text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors p-1"
                    aria-label="Abrir no Pipefy"
                    title="Abrir no Pipefy"
                >
                    <PipefyIcon className="h-3 w-3" size={12} />
                </Button>
            )}

            {notionUrl && (
                <Button
                    variant={variant}
                    size={size}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenLink(notionUrl, 'Notion');
                    }}
                    className="text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors p-1"
                    aria-label="Abrir no Notion"
                    title="Abrir no Notion"
                >
                    <SiNotion className="h-3 w-3" />
                </Button>
            )}
        </div>
    );
}
