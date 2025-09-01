import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n, Language } from '@/contexts/I18nContext';

interface LanguageSelectorProps {
    readonly variant?: 'default' | 'ghost' | 'outline';
    readonly size?: 'sm' | 'default' | 'lg';
    readonly className?: string;
}

export const LanguageSelector = ({
    variant = 'ghost',
    size = 'sm',
    className = ''
}: LanguageSelectorProps) => {
    const { language, setLanguage, t } = useI18n();

    const languages: { code: Language; name: string; flag: string; abbreviation: string }[] = [
        { code: 'en-US', name: t.languages['en-US'], flag: '🇺🇸', abbreviation: 'ENG' },
        { code: 'pt-BR', name: t.languages['pt-BR'], flag: '🇧🇷', abbreviation: 'PT-BR' },
        { code: 'es-ES', name: t.languages['es-ES'], flag: '🇪🇸', abbreviation: 'SPN' },
    ];

    const currentLanguage = languages.find(lang => lang.code === language);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    className={`gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 touch-manipulation ${className}`}
                    aria-label={t.a11y.changeLanguage}
                    title={t.a11y.changeLanguage}
                >
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm">
                        {currentLanguage?.flag}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex items-center gap-2 cursor-pointer ${language === lang.code ? 'bg-accent' : ''
                            }`}
                    >
                        <span className="text-base">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.abbreviation}</span>
                        <span className="text-xs text-muted-foreground">{lang.name}</span>
                        {language === lang.code && (
                            <span className="ml-auto text-xs text-muted-foreground">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
