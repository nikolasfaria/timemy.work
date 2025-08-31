import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// Supported languages
export type Language = 'pt-BR' | 'en-US';

// Translation keys structure
interface Translations {
    // Common
    common: {
        cancel: string;
        confirm: string;
        yes: string;
        no: string;
        loading: string;
        error: string;
        success: string;
        back: string;
        archive: string;
        task: string;
        tasks: string;
    };

    // Navigation and Headers
    nav: {
        title: string;
        subtitle: string;
        createFirstTask: string;
        createTask: string;
    };

    // Kanban Board
    kanban: {
        columns: {
            todo: string;
            progress: string;
            doing: string;
            done: string;
        };
        noTasks: string;
        dragToMove: string;
    };

    // Task Card
    taskCard: {
        progress: string;
        showChecklist: string;
        hideChecklist: string;
        pomodoro: string;
        minutes: string;
        moveTo: string;
        markAsDone: string;
    };

    // Confirmation Dialog
    confirmation: {
        markDoneTitle: string;
        markDoneMessages: string[];
        markDoneDescription: string;
    };

    // Archive
    archive: {
        title: string;
        noArchivedTasks: string;
        archivedTasksCount: string;
        completedTasks: string;
        completedOn: string;
        itemsCompleted: string;
        backToKanban: string;
    };

    // Accessibility
    a11y: {
        dragTask: string;
        dropZone: string;
        taskMenu: string;
        pomodoroTimer: string;
        playTimer: string;
        pauseTimer: string;
        stopTimer: string;
        taskProgress: string;
        checklistItem: string;
    };
}

// Portuguese translations
const ptBR: Translations = {
    common: {
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        yes: 'Sim',
        no: 'Não',
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        back: 'Voltar',
        archive: 'Archive',
        task: 'tarefa',
        tasks: 'tarefas',
    },

    nav: {
        title: 'time my work',
        subtitle: 'Organize suas tarefas com kanban e aumente sua produtividade com pomodoro',
        createFirstTask: 'Crie sua primeira tarefa para começar',
        createTask: 'Criar Tarefa',
    },

    kanban: {
        columns: {
            todo: 'To Do',
            progress: 'Row',
            doing: 'Doing',
            done: 'Done',
        },
        noTasks: 'Nenhuma tarefa',
        dragToMove: 'Arraste para mover entre colunas',
    },

    taskCard: {
        progress: 'Progress',
        showChecklist: 'Show Checklist',
        hideChecklist: 'Hide Checklist',
        pomodoro: 'Pomodoro',
        minutes: 'minutos',
        moveTo: 'Move to',
        markAsDone: 'Mark as Done',
    },

    confirmation: {
        markDoneTitle: 'Finalizar Tarefa',
        markDoneMessages: [
            'Você testou antes? Tem certeza disso? 🧪',
            'Revisou tudo? Não esqueceu nada? 🔍',
            'Fez o commit? Não me diga que esqueceu! 💾',
            'Documentou o código? Seu eu futuro agradece! 📝',
            'Rodou os testes? Ou vamos descobrir em produção? 🚀',
            'Certeza que não tem nenhum console.log perdido? 🐛',
            'Fez backup? Murphy está sempre observando... ⚠️',
            'Tem certeza que funciona ou só funciona na sua máquina? 💻',
            'Revisou o PR? Ou vai ser aquele "LGTM" maroto? 👀',
            'Testou em diferentes navegadores? IE6 conta! 🌐',
        ],
        markDoneDescription: 'Esta ação irá mover a tarefa para o arquivo automaticamente.',
    },

    archive: {
        title: 'Arquivo',
        noArchivedTasks: 'Nenhuma tarefa arquivada',
        archivedTasksCount: 'tarefa arquivada',
        completedTasks: 'Tarefas Concluídas',
        completedOn: 'Concluída em',
        itemsCompleted: 'itens concluídos',
        backToKanban: 'Voltar ao Kanban',
    },

    a11y: {
        dragTask: 'Arrastar tarefa',
        dropZone: 'Zona de soltar',
        taskMenu: 'Menu da tarefa',
        pomodoroTimer: 'Timer Pomodoro',
        playTimer: 'Iniciar timer',
        pauseTimer: 'Pausar timer',
        stopTimer: 'Parar timer',
        taskProgress: 'Progresso da tarefa',
        checklistItem: 'Item do checklist',
    },
};

// English translations
const enUS: Translations = {
    common: {
        cancel: 'Cancel',
        confirm: 'Confirm',
        yes: 'Yes',
        no: 'No',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        back: 'Back',
        archive: 'Archive',
        task: 'task',
        tasks: 'tasks',
    },

    nav: {
        title: 'time my work',
        subtitle: 'Organize your tasks with kanban and boost your productivity with pomodoro',
        createFirstTask: 'Create your first task to get started',
        createTask: 'Create Task',
    },

    kanban: {
        columns: {
            todo: 'To Do',
            progress: 'In Progress',
            doing: 'Doing',
            done: 'Done',
        },
        noTasks: 'No tasks',
        dragToMove: 'Drag to move between columns',
    },

    taskCard: {
        progress: 'Progress',
        showChecklist: 'Show Checklist',
        hideChecklist: 'Hide Checklist',
        pomodoro: 'Pomodoro',
        minutes: 'minutes',
        moveTo: 'Move to',
        markAsDone: 'Mark as Done',
    },

    confirmation: {
        markDoneTitle: 'Complete Task',
        markDoneMessages: [
            'Did you test it first? Are you sure about that? 🧪',
            'Did you review everything? Didn\'t forget anything? 🔍',
            'Did you commit? Don\'t tell me you forgot! 💾',
            'Did you document the code? Your future self thanks you! 📝',
            'Did you run the tests? Or are we finding out in production? 🚀',
            'Sure there\'s no console.log left behind? 🐛',
            'Did you backup? Murphy is always watching... ⚠️',
            'Are you sure it works or does it just work on your machine? 💻',
            'Did you review the PR? Or is it going to be that sneaky "LGTM"? 👀',
            'Did you test on different browsers? IE6 counts! 🌐',
        ],
        markDoneDescription: 'This action will automatically move the task to archive.',
    },

    archive: {
        title: 'Archive',
        noArchivedTasks: 'No archived tasks',
        archivedTasksCount: 'archived task',
        completedTasks: 'Completed Tasks',
        completedOn: 'Completed on',
        itemsCompleted: 'items completed',
        backToKanban: 'Back to Kanban',
    },

    a11y: {
        dragTask: 'Drag task',
        dropZone: 'Drop zone',
        taskMenu: 'Task menu',
        pomodoroTimer: 'Pomodoro timer',
        playTimer: 'Start timer',
        pauseTimer: 'Pause timer',
        stopTimer: 'Stop timer',
        taskProgress: 'Task progress',
        checklistItem: 'Checklist item',
    },
};

// Translation dictionary
const translations: Record<Language, Translations> = {
    'pt-BR': ptBR,
    'en-US': enUS,
};

// Context interface
interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
    formatPlural: (count: number, singular: string, plural: string) => string;
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider component
interface I18nProviderProps {
    readonly children: ReactNode;
    readonly defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage = 'pt-BR' }: I18nProviderProps) {
    const [language, setLanguage] = useState<Language>(defaultLanguage);

    const formatPlural = (count: number, singular: string, plural: string): string => {
        return count === 1 ? singular : plural;
    };

    const value: I18nContextType = useMemo(() => ({
        language,
        setLanguage,
        t: translations[language],
        formatPlural,
    }), [language]);

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}

// Hook to use i18n
export function useI18n(): I18nContextType {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

// Helper hook for translations
export function useTranslation() {
    const { t, formatPlural } = useI18n();
    return { t, formatPlural };
}
