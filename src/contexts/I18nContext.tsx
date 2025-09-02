import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';

// Supported languages
export type Language = 'en-US' | 'pt-BR' | 'es-ES';

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
        save: string;
        edit: string;
        delete: string;
        restore: string;
        clear: string;
        donate: string;
        hello: string;
        custom: string;
        theme: string;
        light: string;
        dark: string;
        system: string;
        minutes: string;
        showMore: string;
        showLess: string;
    };

    // Navigation and Headers
    nav: {
        title: string;
        subtitle: string;
        createFirstTask: string;
        createTask: string;
        greeting: string;
    };

    // Kanban Board
    kanban: {
        columns: {
            todo: string;
            row: string;
            doing: string;
            done: string;
        };
        noTasks: string;
        dragToMove: string;
        dropHere: string;
    };

    // Task Management
    task: {
        // Card actions
        showChecklist: string;
        hideChecklist: string;
        pomodoro: string;
        markAsDone: string;
        viewDetails: string;

        // Timer
        timerActive: string;
        timerCompleted: string;
        timerCompletedDescription: string;
        timerPaused: string;
        startTimer: string;
        pauseTimer: string;
        stopTimer: string;
        resetTimer: string;
        timerOnlyInDoing: string;

        // Success messages
        taskCompleted: string;
        taskArchivedNotification: string;
        undoAction: string;
        okUnderstood: string;

        // Status
        moveToDone: string;
        moveToTodo: string;
        leaveForLater: string;

        // Details
        title: string;
        description: string;
        effort: string;
        complexity: string;
        checklist: string;
        addChecklistItem: string;
        externalLinks: string;
        github: string;
        pipefy: string;
        notion: string;

        // Effort levels
        effortXS: string;
        effortS: string;
        effortM: string;
        effortL: string;
        effortXL: string;

        // Complexity levels
        complexityEasy: string;
        complexityMedium: string;
        complexityHard: string;

        // Time tracking
        timeSpent: string;
        totalTime: string;
    };

    // Dialogs and Modals
    dialogs: {
        // Confirmation
        markDoneTitle: string;
        markDoneMessages: string[];
        markDoneDescription: string;

        deleteTaskTitle: string;
        deleteTaskDescription: string;

        clearArchiveTitle: string;
        clearArchiveDescription: string;

        timerConflictTitle: string;
        timerConflictSubtitle: string;
        timerConflictDescription: string;
        timerConflictMessages: string[];
        moveToTodo: string;

        // Custom timer
        customTimerTitle: string;
        customTimerLabel: string;
        customTimerPlaceholder: string;

        // Task creation/editing
        createTaskTitle: string;
        editTaskTitle: string;
        taskIdLabel: string;
        taskIdPlaceholder: string;
        taskTitleLabel: string;
        taskTitlePlaceholder: string;
        taskDescriptionLabel: string;
        taskDescriptionPlaceholder: string;
        taskEffortLabel: string;
        taskComplexityLabel: string;
        taskChecklistLabel: string;
        addChecklistItemPlaceholder: string;
        externalLinksLabel: string;
        githubPlaceholder: string;
        pipefyPlaceholder: string;
        notionPlaceholder: string;
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
        restoreToTodo: string;
        clearArchive: string;
        tasksWillAppearHere: string;
    };

    // Donate
    donate: {
        title: string;
        supportProject: string;
        donateInfo: string;
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
        openGithub: string;
        openPipefy: string;
        openNotion: string;
        toggleTheme: string;
        changeLanguage: string;
        userMenu: string;
        taskDetails: string;
        closePanel: string;
        makeDonation: string;
    };

    // Language names
    languages: {
        'en-US': string;
        'pt-BR': string;
        'es-ES': string;
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
        archive: 'Arquivo',
        task: 'tarefa',
        tasks: 'tarefas',
        save: 'Salvar',
        edit: 'Editar',
        delete: 'Excluir',
        restore: 'Restaurar',
        clear: 'Limpar',
        donate: 'Doar',
        hello: 'Olá',
        custom: 'Personalizado',
        theme: 'Tema',
        light: 'Claro',
        dark: 'Escuro',
        system: 'Sistema',
        minutes: 'minutos',
        showMore: 'Mostrar mais',
        showLess: 'Mostrar menos',
    },

    nav: {
        title: 'time my work',
        subtitle: 'Organize suas tarefas com kanban e aumente sua produtividade com pomodoro',
        createFirstTask: 'Crie sua primeira tarefa para começar',
        createTask: 'Criar Tarefa',
        greeting: 'Olá 👋',
    },

    kanban: {
        columns: {
            todo: 'A Fazer',
            row: 'Row',
            doing: 'Fazendo',
            done: 'Concluído',
        },
        noTasks: 'Nenhuma tarefa',
        dragToMove: 'Arraste para mover entre colunas',
        dropHere: 'Solte aqui',
    },

    task: {
        showChecklist: 'Mostrar Lista',
        hideChecklist: 'Ocultar Lista',
        pomodoro: 'Pomodoro',
        markAsDone: 'Marcar como Concluído',
        viewDetails: 'Ver Detalhes',

        timerActive: 'Timer Ativo',
        timerCompleted: 'Timer Concluído',
        timerCompletedDescription: 'Parabéns! Você completou uma sessão de foco para: "{taskTitle}"',
        timerPaused: 'Timer Pausado',
        startTimer: 'Iniciar Timer',
        pauseTimer: 'Pausar Timer',
        stopTimer: 'Parar Timer',
        resetTimer: 'Resetar Timer',
        timerOnlyInDoing: 'Timer disponível apenas para tarefas em "Fazendo"',

        // Success messages
        taskCompleted: 'Parabéns! Tarefa concluída! 🎉',
        taskArchivedNotification: 'Tarefa movida para os arquivados',
        undoAction: 'Desfazer',
        okUnderstood: 'Ok, entendi',

        moveToDone: 'Mover para Concluído',
        moveToTodo: 'Mover para A Fazer',
        leaveForLater: 'Deixar para Mais Tarde',

        title: 'Título',
        description: 'Descrição',
        effort: 'Esforço',
        complexity: 'Complexidade',
        checklist: 'Lista de Verificação',
        addChecklistItem: 'Adicionar item à lista',
        externalLinks: 'Links Externos',
        github: 'GitHub',
        pipefy: 'Pipefy',
        notion: 'Notion',

        effortXS: 'Muito Pequeno',
        effortS: 'Pequeno',
        effortM: 'Médio',
        effortL: 'Grande',
        effortXL: 'Muito Grande',

        complexityEasy: 'Fácil',
        complexityMedium: 'Médio',
        complexityHard: 'Difícil',

        timeSpent: 'Tempo Gasto',
        totalTime: 'Tempo Total',
    },

    dialogs: {
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

        deleteTaskTitle: 'Excluir Tarefa',
        deleteTaskDescription: 'Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.',

        clearArchiveTitle: 'Limpar Arquivo',
        clearArchiveDescription: 'Tem certeza que deseja excluir todas as tarefas arquivadas? Esta ação não pode ser desfeita.',

        timerConflictTitle: 'Calma aí campeão!',
        timerConflictSubtitle: 'Uma coisa de cada vez!',
        timerConflictDescription: 'Deseja pausar a tarefa atual e substituir por essa nova?',
        timerConflictMessages: [
            'Ei, devagar! Uma tarefa por vez! 🐌',
            'Calma aí, campeão! Foco é tudo! 🎯',
            'Opa! Multitarefa não funciona aqui! 🚫',
            'Respirar fundo e uma coisa de cada vez! 🧘‍♂️',
            'Ei! Não somos polvos para fazer tudo ao mesmo tempo! 🐙',
        ],
        moveToTodo: 'Mover para A Fazer',

        customTimerTitle: 'Timer Personalizado',
        customTimerLabel: 'Minutos',
        customTimerPlaceholder: 'Digite os minutos (ex: 25)',

        createTaskTitle: 'Criar Nova Tarefa',
        editTaskTitle: 'Editar Tarefa',
        taskIdLabel: 'ID da Tarefa',
        taskIdPlaceholder: 'Ex: TASK-001',
        taskTitleLabel: 'Título',
        taskTitlePlaceholder: 'Digite o título da tarefa',
        taskDescriptionLabel: 'Descrição',
        taskDescriptionPlaceholder: 'Descreva sua tarefa aqui...',
        taskEffortLabel: 'Esforço',
        taskComplexityLabel: 'Complexidade',
        taskChecklistLabel: 'Lista de Verificação',
        addChecklistItemPlaceholder: 'Adicionar novo item...',
        externalLinksLabel: 'Links Externos',
        githubPlaceholder: 'https://github.com/usuario/repositorio',
        pipefyPlaceholder: 'https://app.pipefy.com/pipes/123456',
        notionPlaceholder: 'https://notion.so/pagina-da-tarefa',
    },

    archive: {
        title: 'Arquivo',
        noArchivedTasks: 'Nenhuma tarefa arquivada',
        archivedTasksCount: 'tarefa arquivada',
        completedTasks: 'Tarefas Concluídas',
        completedOn: 'Concluída em',
        itemsCompleted: 'itens concluídos',
        backToKanban: 'Voltar ao Kanban',
        restoreToTodo: 'Restaurar para A Fazer',
        clearArchive: 'Limpar Arquivo',
        tasksWillAppearHere: 'Tarefas concluídas aparecerão aqui automaticamente',
    },

    donate: {
        title: 'Apoie o Projeto',
        supportProject: 'Apoie o projeto com uma doação',
        donateInfo: 'Informações de doação',
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
        checklistItem: 'Item da lista',
        openGithub: 'Abrir no GitHub',
        openPipefy: 'Abrir no Pipefy',
        openNotion: 'Abrir no Notion',
        toggleTheme: 'Alternar tema',
        changeLanguage: 'Alterar idioma',
        userMenu: 'Menu do usuário',
        taskDetails: 'Detalhes da tarefa',
        closePanel: 'Fechar painel',
        makeDonation: 'Fazer uma doação via PayPal',
    },

    languages: {
        'en-US': 'English',
        'pt-BR': 'Português',
        'es-ES': 'Español',
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
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        restore: 'Restore',
        clear: 'Clear',
        donate: 'Donate',
        hello: 'Hello',
        custom: 'Custom',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        minutes: 'minutes',
        showMore: 'Show more',
        showLess: 'Show less',
    },

    nav: {
        title: 'time my work',
        subtitle: 'Organize your tasks with kanban and boost your productivity with pomodoro',
        createFirstTask: 'Create your first task to get started',
        createTask: 'Create Task',
        greeting: 'Hello 👋',
    },

    kanban: {
        columns: {
            todo: 'To Do',
            row: 'Row',
            doing: 'Doing',
            done: 'Done',
        },
        noTasks: 'No tasks',
        dragToMove: 'Drag to move between columns',
        dropHere: 'Drop here',
    },

    task: {
        showChecklist: 'Show Checklist',
        hideChecklist: 'Hide Checklist',
        pomodoro: 'Pomodoro',
        markAsDone: 'Mark as Done',
        viewDetails: 'View Details',

        timerActive: 'Timer Active',
        timerCompleted: 'Timer Completed',
        timerCompletedDescription: 'Congratulations! You completed a focus session for: "{taskTitle}"',
        timerPaused: 'Timer Paused',
        startTimer: 'Start Timer',
        pauseTimer: 'Pause Timer',
        stopTimer: 'Stop Timer',
        resetTimer: 'Reset Timer',
        timerOnlyInDoing: 'Timer is only available for tasks in "Doing" status',

        // Success messages
        taskCompleted: 'Congratulations! Task completed! 🎉',
        taskArchivedNotification: 'Task moved to archives',
        undoAction: 'Undo',
        okUnderstood: 'Ok, got it',

        moveToDone: 'Move to Done',
        moveToTodo: 'Move to To Do',
        leaveForLater: 'Leave for Later',

        title: 'Title',
        description: 'Description',
        effort: 'Effort',
        complexity: 'Complexity',
        checklist: 'Checklist',
        addChecklistItem: 'Add checklist item',
        externalLinks: 'External Links',
        github: 'GitHub',
        pipefy: 'Pipefy',
        notion: 'Notion',

        effortXS: 'Extra Small',
        effortS: 'Small',
        effortM: 'Medium',
        effortL: 'Large',
        effortXL: 'Extra Large',

        complexityEasy: 'Easy',
        complexityMedium: 'Medium',
        complexityHard: 'Hard',

        timeSpent: 'Time Spent',
        totalTime: 'Total Time',
    },

    dialogs: {
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

        deleteTaskTitle: 'Delete Task',
        deleteTaskDescription: 'Are you sure you want to delete this task? This action cannot be undone.',

        clearArchiveTitle: 'Clear Archive',
        clearArchiveDescription: 'Are you sure you want to delete all archived tasks? This action cannot be undone.',

        timerConflictTitle: 'Hold on there, champ!',
        timerConflictSubtitle: 'One thing at a time!',
        timerConflictDescription: 'Do you want to pause the current task and replace it with this new one?',
        timerConflictMessages: [
            'Hey, slow down! One task at a time! 🐌',
            'Hold on, champ! Focus is everything! 🎯',
            'Oops! Multitasking doesn\'t work here! 🚫',
            'Take a deep breath and one thing at a time! 🧘‍♂️',
            'Hey! We\'re not octopuses to do everything at once! 🐙',
        ],
        moveToTodo: 'Move to To Do',

        customTimerTitle: 'Custom Timer',
        customTimerLabel: 'Minutes',
        customTimerPlaceholder: 'Enter minutes (e.g., 25)',

        createTaskTitle: 'Create New Task',
        editTaskTitle: 'Edit Task',
        taskIdLabel: 'Task ID',
        taskIdPlaceholder: 'e.g., TASK-001',
        taskTitleLabel: 'Title',
        taskTitlePlaceholder: 'Enter task title',
        taskDescriptionLabel: 'Description',
        taskDescriptionPlaceholder: 'Describe your task here...',
        taskEffortLabel: 'Effort',
        taskComplexityLabel: 'Complexity',
        taskChecklistLabel: 'Checklist',
        addChecklistItemPlaceholder: 'Add new item...',
        externalLinksLabel: 'External Links',
        githubPlaceholder: 'https://github.com/user/repository',
        pipefyPlaceholder: 'https://app.pipefy.com/pipes/123456',
        notionPlaceholder: 'https://notion.so/task-page',
    },

    archive: {
        title: 'Archive',
        noArchivedTasks: 'No archived tasks',
        archivedTasksCount: 'archived task',
        completedTasks: 'Completed Tasks',
        completedOn: 'Completed on',
        itemsCompleted: 'items completed',
        backToKanban: 'Back to Kanban',
        restoreToTodo: 'Restore to To Do',
        clearArchive: 'Clear Archive',
        tasksWillAppearHere: 'Completed tasks will appear here automatically',
    },

    donate: {
        title: 'Support the Project',
        supportProject: 'Support the project with a donation',
        donateInfo: 'Donation information',
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
        openGithub: 'Open on GitHub',
        openPipefy: 'Open on Pipefy',
        openNotion: 'Open on Notion',
        toggleTheme: 'Toggle theme',
        changeLanguage: 'Change language',
        userMenu: 'User menu',
        taskDetails: 'Task details',
        closePanel: 'Close panel',
        makeDonation: 'Make a donation via PayPal',
    },

    languages: {
        'en-US': 'English',
        'pt-BR': 'Português',
        'es-ES': 'Español',
    },
};

// Spanish translations
const esES: Translations = {
    common: {
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        yes: 'Sí',
        no: 'No',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        back: 'Volver',
        archive: 'Archivo',
        task: 'tarea',
        tasks: 'tareas',
        save: 'Guardar',
        edit: 'Editar',
        delete: 'Eliminar',
        restore: 'Restaurar',
        clear: 'Limpiar',
        donate: 'Donar',
        hello: 'Hola',
        custom: 'Personalizado',
        theme: 'Tema',
        light: 'Claro',
        dark: 'Oscuro',
        system: 'Sistema',
        minutes: 'minutos',
        showMore: 'Mostrar más',
        showLess: 'Mostrar menos',
    },

    nav: {
        title: 'time my work',
        subtitle: 'Organiza tus tareas con kanban y aumenta tu productividad con pomodoro',
        createFirstTask: 'Crea tu primera tarea para comenzar',
        createTask: 'Crear Tarea',
        greeting: 'Hola 👋',
    },

    kanban: {
        columns: {
            todo: 'Por Hacer',
            row: 'Row',
            doing: 'Haciendo',
            done: 'Completado',
        },
        noTasks: 'Sin tareas',
        dragToMove: 'Arrastra para mover entre columnas',
        dropHere: 'Suelta aquí',
    },

    task: {
        showChecklist: 'Mostrar Lista',
        hideChecklist: 'Ocultar Lista',
        pomodoro: 'Pomodoro',
        markAsDone: 'Marcar como Completado',
        viewDetails: 'Ver Detalles',

        timerActive: 'Timer Activo',
        timerCompleted: 'Timer Completado',
        timerCompletedDescription: '¡Felicidades! Completaste una sesión de enfoque para: "{taskTitle}"',
        timerPaused: 'Timer Pausado',
        startTimer: 'Iniciar Timer',
        pauseTimer: 'Pausar Timer',
        stopTimer: 'Detener Timer',
        resetTimer: 'Reiniciar Timer',
        timerOnlyInDoing: 'Timer disponible solo para tareas en "Haciendo"',

        // Success messages
        taskCompleted: '¡Felicitaciones! ¡Tarea completada! 🎉',
        taskArchivedNotification: 'Tarea movida a los archivos',
        undoAction: 'Deshacer',
        okUnderstood: 'Ok, entendido',

        moveToDone: 'Mover a Completado',
        moveToTodo: 'Mover a Por Hacer',
        leaveForLater: 'Dejar para Más Tarde',

        title: 'Título',
        description: 'Descripción',
        effort: 'Esfuerzo',
        complexity: 'Complejidad',
        checklist: 'Lista de Verificación',
        addChecklistItem: 'Agregar elemento a la lista',
        externalLinks: 'Enlaces Externos',
        github: 'GitHub',
        pipefy: 'Pipefy',
        notion: 'Notion',

        effortXS: 'Muy Pequeño',
        effortS: 'Pequeño',
        effortM: 'Mediano',
        effortL: 'Grande',
        effortXL: 'Muy Grande',

        complexityEasy: 'Fácil',
        complexityMedium: 'Medio',
        complexityHard: 'Difícil',

        timeSpent: 'Tiempo Gastado',
        totalTime: 'Tiempo Total',
    },

    dialogs: {
        markDoneTitle: 'Completar Tarea',
        markDoneMessages: [
            '¿Lo probaste antes? ¿Estás seguro de eso? 🧪',
            '¿Revisaste todo? ¿No olvidaste nada? 🔍',
            '¿Hiciste el commit? ¡No me digas que se te olvidó! 💾',
            '¿Documentaste el código? ¡Tu yo futuro te lo agradece! 📝',
            '¿Ejecutaste las pruebas? ¿O lo descubriremos en producción? 🚀',
            '¿Seguro que no hay ningún console.log perdido? 🐛',
            '¿Hiciste respaldo? Murphy siempre está observando... ⚠️',
            '¿Estás seguro que funciona o solo funciona en tu máquina? 💻',
            '¿Revisaste el PR? ¿O va a ser ese "LGTM" travieso? 👀',
            '¿Probaste en diferentes navegadores? ¡IE6 cuenta! 🌐',
        ],
        markDoneDescription: 'Esta acción moverá automáticamente la tarea al archivo.',

        deleteTaskTitle: 'Eliminar Tarea',
        deleteTaskDescription: '¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.',

        clearArchiveTitle: 'Limpiar Archivo',
        clearArchiveDescription: '¿Estás seguro de que quieres eliminar todas las tareas archivadas? Esta acción no se puede deshacer.',

        timerConflictTitle: '¡Tranquilo campeón!',
        timerConflictSubtitle: '¡Una cosa a la vez!',
        timerConflictDescription: '¿Quieres pausar la tarea actual y reemplazarla con esta nueva?',
        timerConflictMessages: [
            '¡Oye, despacio! ¡Una tarea a la vez! 🐌',
            '¡Tranquilo, campeón! ¡El enfoque es todo! 🎯',
            '¡Ups! ¡Multitarea no funciona aquí! 🚫',
            '¡Respira profundo y una cosa a la vez! 🧘‍♂️',
            '¡Oye! ¡No somos pulpos para hacer todo al mismo tiempo! 🐙',
        ],
        moveToTodo: 'Mover a Por Hacer',

        customTimerTitle: 'Timer Personalizado',
        customTimerLabel: 'Minutos',
        customTimerPlaceholder: 'Ingresa minutos (ej: 25)',

        createTaskTitle: 'Crear Nueva Tarea',
        editTaskTitle: 'Editar Tarea',
        taskIdLabel: 'ID de Tarea',
        taskIdPlaceholder: 'ej: TASK-001',
        taskTitleLabel: 'Título',
        taskTitlePlaceholder: 'Ingresa el título de la tarea',
        taskDescriptionLabel: 'Descripción',
        taskDescriptionPlaceholder: 'Describe tu tarea aquí...',
        taskEffortLabel: 'Esfuerzo',
        taskComplexityLabel: 'Complejidad',
        taskChecklistLabel: 'Lista de Verificación',
        addChecklistItemPlaceholder: 'Agregar nuevo elemento...',
        externalLinksLabel: 'Enlaces Externos',
        githubPlaceholder: 'https://github.com/usuario/repositorio',
        pipefyPlaceholder: 'https://app.pipefy.com/pipes/123456',
        notionPlaceholder: 'https://notion.so/pagina-de-tarea',
    },

    archive: {
        title: 'Archivo',
        noArchivedTasks: 'Sin tareas archivadas',
        archivedTasksCount: 'tarea archivada',
        completedTasks: 'Tareas Completadas',
        completedOn: 'Completada el',
        itemsCompleted: 'elementos completados',
        backToKanban: 'Volver al Kanban',
        restoreToTodo: 'Restaurar a Por Hacer',
        clearArchive: 'Limpiar Archivo',
        tasksWillAppearHere: 'Las tareas completadas aparecerán aquí automáticamente',
    },

    donate: {
        title: 'Apoya el Proyecto',
        supportProject: 'Apoya el proyecto con una donación',
        donateInfo: 'Información de donación',
    },

    a11y: {
        dragTask: 'Arrastrar tarea',
        dropZone: 'Zona de soltar',
        taskMenu: 'Menú de tarea',
        pomodoroTimer: 'Timer Pomodoro',
        playTimer: 'Iniciar timer',
        pauseTimer: 'Pausar timer',
        stopTimer: 'Detener timer',
        taskProgress: 'Progreso de tarea',
        checklistItem: 'Elemento de lista',
        openGithub: 'Abrir en GitHub',
        openPipefy: 'Abrir en Pipefy',
        openNotion: 'Abrir en Notion',
        toggleTheme: 'Cambiar tema',
        changeLanguage: 'Cambiar idioma',
        userMenu: 'Menú de usuario',
        taskDetails: 'Detalles de tarea',
        closePanel: 'Cerrar panel',
        makeDonation: 'Hacer una donación vía PayPal',
    },

    languages: {
        'en-US': 'English',
        'pt-BR': 'Português',
        'es-ES': 'Español',
    },
};

// Translation dictionary
const translations: Record<Language, Translations> = {
    'en-US': enUS,
    'pt-BR': ptBR,
    'es-ES': esES,
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

// Helper function to detect browser language
const detectBrowserLanguage = (): Language => {
    if (typeof window === 'undefined') return 'en-US';

    const browserLang = navigator.language || navigator.languages?.[0] || 'en-US';

    // Map browser language codes to our supported languages
    if (browserLang.startsWith('pt')) return 'pt-BR';
    if (browserLang.startsWith('es')) return 'es-ES';
    return 'en-US'; // Default to English
};

// Helper function to get stored language or detect browser language
const getInitialLanguage = (): Language => {
    if (typeof window === 'undefined') return 'en-US';

    try {
        const stored = localStorage.getItem('timemywork-language') as Language;
        if (stored && ['en-US', 'pt-BR', 'es-ES'].includes(stored)) {
            return stored;
        }
    } catch (error) {
        console.warn('Failed to read language from localStorage:', error);
    }

    return detectBrowserLanguage();
};

// Provider component
interface I18nProviderProps {
    readonly children: ReactNode;
    readonly defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage }: I18nProviderProps) {
    const [language, setLanguageState] = useState<Language>('en-US');

    // Initialize language on mount
    useEffect(() => {
        const initialLanguage = defaultLanguage || getInitialLanguage();
        setLanguageState(initialLanguage);
    }, [defaultLanguage]);

    // Persist language changes to localStorage
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        try {
            localStorage.setItem('timemywork-language', lang);
        } catch (error) {
            console.warn('Failed to save language to localStorage:', error);
        }
    };

    // Auto-detect browser language on first visit (if no stored preference)
    useEffect(() => {
        if (!defaultLanguage) {
            try {
                const stored = localStorage.getItem('timemywork-language');
                if (!stored) {
                    const detected = detectBrowserLanguage();
                    setLanguage(detected);
                }
            } catch (error) {
                console.warn('Failed to auto-detect language:', error);
            }
        }
    }, [defaultLanguage]);

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
