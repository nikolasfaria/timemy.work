import { useState, useEffect } from 'react';

interface DateTimeInfo {
    greeting: string;
    dayOfWeek: string;
    dayOfMonth: string;
    time: string;
    fullDate: Date;
}

export function useDateTime(): DateTimeInfo {
    const [dateTime, setDateTime] = useState<DateTimeInfo>(() => {
        const now = new Date();
        return formatDateTime(now);
    });

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setDateTime(formatDateTime(now));
        };

        // Atualiza imediatamente
        updateDateTime();

        // Atualiza a cada segundo
        const interval = setInterval(updateDateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return dateTime;
}

function formatDateTime(date: Date): DateTimeInfo {
    // Saudação fixa
    const greeting = 'Olá 👋';

    // Dias da semana em português
    const daysOfWeek = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];

    // Meses em português
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = `${date.getDate()} de ${months[date.getMonth()]}`;

    // Formato de horário brasileiro (HH:MM:SS)
    const time = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    return {
        greeting,
        dayOfWeek,
        dayOfMonth,
        time,
        fullDate: date
    };
}
