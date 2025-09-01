import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/I18nContext';

interface DonateButtonProps {
    readonly variant?: 'default' | 'ghost';
    readonly size?: 'sm' | 'xs';
    readonly className?: string;
}

export const DonateButton = ({
    variant = 'ghost',
    size = 'sm',
    className = ''
}: DonateButtonProps) => {
    const { t } = useTranslation();

    return (
        <Link to="/donate">
            <Button
                variant={variant}
                size={size}
                className={`text-muted-foreground hover:text-red-500 transition-colors gap-1 ${className}`}
                aria-label={t.a11y.makeDonation}
                title={t.donate.supportProject}
            >
                <Heart className="h-3 w-3" />
                <span className="text-xs">{t.common.donate}</span>
            </Button>
        </Link>
    );
};
