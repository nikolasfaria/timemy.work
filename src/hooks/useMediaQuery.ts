import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
};

export const useIsMobile = () => {
    return useMediaQuery('(max-width: 768px)');
};

export const useIsTablet = () => {
    return useMediaQuery('(max-width: 1024px) and (min-width: 769px)');
};

export const useIsDesktop = () => {
    return useMediaQuery('(min-width: 1025px)');
};
