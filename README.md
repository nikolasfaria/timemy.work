# TimeMy.Work ⏱️

A modern productivity application that combines Kanban boards with Pomodoro timers to help you organize tasks and maximize efficiency.

## 🚀 Features

### 🎯 Task Management
- **Kanban Board**: Visual task organization with 4 columns (To Do, In Progress, Row, Done)
- **Drag & Drop**: Intuitive task movement with dedicated drag handles
- **Task Details**: Rich markdown descriptions with live preview
- **Checklist System**: Subtasks with progress tracking
- **External Links**: Integration with GitHub, Notion, and Pipefy

### ⏰ Pomodoro Integration
- **Flexible Timers**: 5, 10, 15, 25 minutes or custom duration
- **Visual Feedback**: Elegant yellow pastel timer display
- **Sound Notifications**: Audio alerts when sessions complete
- **Time Tracking**: Accumulated time per task
- **Auto Status**: Tasks automatically move to "Row" when timer starts

### 🎨 Modern UI/UX
- **Apple-like Design**: Clean, minimalist interface
- **Dark/Light Mode**: System preference detection with manual toggle
- **Responsive**: Mobile-first design that works on all devices
- **Accessibility**: WCAG AA 2.1 compliant with full keyboard navigation
- **User Menu**: Centralized avatar popover with all options

### 🌍 Internationalization
- **Multi-language**: English, Portuguese (Brazil), Spanish
- **Auto-detection**: Browser language detection with manual override
- **Real-time Switching**: Instant language changes
- **Localized Dates**: Native date/time formatting per locale

### 🔧 Advanced Features
- **Task Archive**: Completed tasks storage with restore capability
- **Confirmation Dialogs**: Fun, randomized messages for actions
- **Timer Conflicts**: Smart handling when multiple timers are requested
- **One Task Focus**: Enforced single task in "Row" column
- **Toast Notifications**: Modern Sonner-based notifications

## 🛠️ Technology Stack

Built with modern web technologies:

- **⚡ Vite** - Next-generation build tool
- **⚛️ React 18** - UI library with hooks
- **🔷 TypeScript** - Static type checking
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - Modern component library
- **📱 Radix UI** - Accessible primitives
- **🎭 Lucide React** - Beautiful icons
- **🚦 React Router** - Client-side routing
- **🍞 Sonner** - Toast notifications
- **📝 @uiw/react-md-editor** - Markdown editor
- **🎯 @dnd-kit** - Drag and drop
- **🎵 use-sound** - Audio feedback

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager

### Installation

```bash
# 1. Clone the repository
git clone <REPOSITORY_URL>

# 2. Navigate to project directory
cd timemywork-flow

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 📱 Usage

### Basic Workflow

1. **Create Tasks**: Use the "Create Task" button to add new items
2. **Organize**: Drag tasks between columns using the grip handle
3. **Focus**: Start Pomodoro timers for active tasks
4. **Track**: Monitor progress with checklists and time tracking
5. **Complete**: Mark tasks as done with fun confirmation dialogs

### Timer Management

- **Start Timer**: Available only for tasks in "Row" column
- **Multiple Durations**: Choose from 5, 10, 15, 25 minutes or custom
- **Visual Feedback**: Yellow pastel highlight with pulsing indicator
- **Controls**: Pause, resume, or stop from card or sidebar
- **Automatic Movement**: Tasks move between columns based on timer state

### Task Details

- **Click to Open**: Click anywhere on a task card to view details
- **Markdown Support**: Rich text descriptions with live preview
- **Checklist Management**: Add, complete, and reorder subtasks
- **External Links**: Quick access to related GitHub, Notion, or Pipefy pages
- **Timer Control**: Full timer management from the sidebar

## 🎨 Design Philosophy

**TimeMy.Work** follows these principles:

- **Minimalism**: Clean interface with only essential elements
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Optimized bundle size and fast loading
- **Responsive**: Consistent experience across all devices
- **User-Centric**: Intuitive workflows that reduce cognitive load

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run preview      # Preview production build

# Production
npm run build        # Create production build
npm run deploy       # Deploy to Vercel

# Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🌟 Key Features Deep Dive

### Kanban Board
- **4 Columns**: To Do, In Progress, Row, Done
- **Task Limits**: Only one task allowed in "In Progress" and "Row"
- **Smart Movement**: Automatic task redistribution when limits exceeded
- **Visual Indicators**: Color-coded status badges and progress bars

### Pomodoro Timer
- **Global State**: Single timer shared across all components
- **Persistence**: Timer state survives page refreshes
- **Conflict Resolution**: Smart handling of timer conflicts
- **Completion Actions**: Mark done, reset timer, or postpone options

### User Experience
- **Progressive Enhancement**: Works without JavaScript enabled
- **Offline Support**: Local storage for data persistence
- **Error Handling**: Graceful degradation and error recovery
- **Loading States**: Smooth transitions and feedback

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Developed with ❤️ by **Nikolas Faria**

---

**TimeMy.Work** - Where productivity meets simplicity ⚡