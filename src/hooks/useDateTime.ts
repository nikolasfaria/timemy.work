import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface DateTimeInfo {
    greeting: string;
    dayOfWeek: string;
    dayOfMonth: string;
    time: string;
    fullDate: Date;
}

export function useDateTime(): DateTimeInfo {
    const { language, t } = useI18n();
    const [dateTime, setDateTime] = useState<DateTimeInfo>(() => {
        const now = new Date();
        return formatDateTime(now, language, t);
    });

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setDateTime(formatDateTime(now, language, t));
        };

        // Atualiza imediatamente
        updateDateTime();

        // Atualiza a cada segundo
        const interval = setInterval(updateDateTime, 1000);

        return () => clearInterval(interval);
    }, [language, t]);

    return dateTime;
}

function formatDateTime(date: Date, language: string, t: any): DateTimeInfo {
    // Saudação traduzida
    const greeting = t.nav.greeting;

    // Configurações de localização baseadas no idioma
    const localeMap: Record<string, string> = {
        'en-US': 'en-US',
        'pt-BR': 'pt-BR',
        'es-ES': 'es-ES'
    };

    const locale = localeMap[language] || 'en-US';

    // Dias da semana localizados
    const dayOfWeek = date.toLocaleDateString(locale, { weekday: 'long' });

    // Data localizada
    const dayOfMonth = date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long'
    });

    // Horário localizado
    const time = date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: language === 'en-US' // 12h para inglês, 24h para outros
    });

    return {
        greeting,
        dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1), // Primeira letra maiúscula
        dayOfMonth,
        time,
        fullDate: date
    };
}
