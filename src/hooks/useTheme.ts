import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        // Verificar se há tema salvo no localStorage
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            return savedTheme;
        }
        // Se não há tema salvo, usar 'system' como padrão
        return 'system';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remover classes de tema anteriores
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            // Usar preferência do sistema
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            // Usar tema específico
            root.classList.add(theme);
        }

        // Salvar tema no localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Escutar mudanças na preferência do sistema quando tema é 'system'
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(mediaQuery.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light';
        });
    };

    const getCurrentTheme = (): 'light' | 'dark' => {
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
    };

    return {
        theme,
        setTheme,
        toggleTheme,
        currentTheme: getCurrentTheme(),
    };
}
