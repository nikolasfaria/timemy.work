import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, Heart, User, Sun, Moon, Monitor } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LanguageSelector } from './LanguageSelector';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';

interface UserMenuProps {
    readonly className?: string;
    readonly taskCount?: number;
}

export function UserMenu({ className, taskCount = 0 }: UserMenuProps) {
    const { t } = useTranslation();
    const { theme, setTheme, currentTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themeOptions = [
        { value: 'light' as const, label: t.common.light || 'Light', icon: Sun },
        { value: 'dark' as const, label: t.common.dark || 'Dark', icon: Moon },
        { value: 'system' as const, label: t.common.system || 'System', icon: Monitor },
    ];

    const currentThemeOption = themeOptions.find(option => option.value === theme);

    return (
        <div className={cn("flex items-center", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full p-0"
                        aria-label={t.a11y?.userMenu || "User menu"}
                    >
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="" alt="User" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-0" align="end" sideOffset={10}>
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src="" alt="User" />
                                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                    <User className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm">Time My Work</h3>
                                <p className="text-xs text-muted-foreground">
                                    {t.nav?.greeting || "Hello"} 👋
                                </p>
                            </div>
                        </div>

                        <Separator className="mb-3" />

                        {/* Menu Items */}
                        <div className="space-y-1">
                            {/* Archive */}
                            <Link to="/archive" onClick={() => setIsOpen(false)}>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-10 px-3 text-sm"
                                >
                                    <Archive className="h-4 w-4" />
                                    <span className="flex-1 text-left">{t.nav?.archive || "Archive"}</span>
                                    {taskCount > 0 && (
                                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                            {taskCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            {/* Donate */}
                            <Link to="/donate" onClick={() => setIsOpen(false)}>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-10 px-3 text-sm"
                                >
                                    <Heart className="h-4 w-4" />
                                    <span className="flex-1 text-left">{t.common?.donate || "Donate"}</span>
                                </Button>
                            </Link>

                            <Separator className="my-3" />

                            {/* Language Selector */}
                            <div className="px-3 py-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{t.a11y?.changeLanguage || "Language"}</span>
                                    <LanguageSelector variant="outline" size="sm" />
                                </div>
                            </div>

                            <Separator className="my-3" />

                            {/* Theme Selector */}
                            <div className="px-3 py-2">
                                <span className="text-sm font-medium block mb-2">{t.common?.theme || "Theme"}</span>
                                <div className="grid grid-cols-3 gap-1">
                                    {themeOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        const isSelected = theme === option.value;

                                        return (
                                            <Button
                                                key={option.value}
                                                variant={isSelected ? "default" : "ghost"}
                                                size="sm"
                                                className={cn(
                                                    "flex flex-col gap-1 h-auto py-2 px-1",
                                                    isSelected && "bg-primary text-primary-foreground"
                                                )}
                                                onClick={() => setTheme(option.value)}
                                            >
                                                <IconComponent className="h-4 w-4" />
                                                <span className="text-xs">{option.label}</span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
