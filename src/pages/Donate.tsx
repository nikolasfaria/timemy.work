import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/I18nContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import donateImage from '@/assets/donate.webp';

const Donate = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header com botão de voltar */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            {t.common.back}
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <LanguageSelector />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Conteúdo centralizado */}
            <div className="flex-1 flex items-center justify-center py-8 px-4">
                <div className="w-full max-w-4xl">
                    <img
                        src={donateImage}
                        alt={t.donate.donateInfo}
                        className="w-full h-auto max-h-[calc(100vh-12rem)] object-contain rounded-lg mx-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default Donate;
