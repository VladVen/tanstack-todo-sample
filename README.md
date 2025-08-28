# TanStack Todo Sample

A modern Todo application built with React, TypeScript, and Vite. This application provides a clean, responsive UI for managing tasks with drag-and-drop functionality between different status columns.

## Features

- **Todo Management**: Create, update, and delete todo items
- **Drag and Drop**: Move todos between status columns (To Do, In Progress, Done)
- **Internationalization**: Support for multiple languages
- **Responsive Design**: Works on desktop and mobile devices
- **Theme Support**: Light and dark mode with system preference detection
- **Toast Notifications**: User-friendly notifications for actions

## Core Technologies

### Frontend
- **React 19**: Latest version of the React library
- **TypeScript**: For type safety and better developer experience
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components

### State Management & Data Fetching
- **Zustand**: Simple state management
- **TanStack Query**: Data fetching, caching, and state management
- **TanStack Router**: Type-safe routing with file-based routes
- **TanStack Table**: Powerful table/data-grid for React

### Drag and Drop
- **DND Kit**: Modern, accessible drag and drop library for React

### Backend
- **Supabase**: Backend-as-a-Service for database and authentication

### Form Handling & Validation
- **Formik**: Form management
- **Yup**: Schema validation

## Project Structure

```
src/
├── api/            # API clients and endpoints
├── components/     # UI components
├── hooks/          # Custom React hooks
├── i18n/           # Internationalization setup
├── lib/            # Utility functions
├── modals/         # Modal components
├── providers/      # Context providers
├── queries/        # React Query hooks
├── routes/         # Application routes
├── store/          # Zustand state stores
└── validations/    # Form and data validation schemas
```

## Requirements

- Node.js 22.1.0+
- npm 10+

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tanstack-todo-sample.git
cd tanstack-todo-sample

# Install dependencies
npm install
```

### Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
# VITE_SUPABASE_URL should point to your Supabase project URL
```

You'll need to create a Supabase project and get your project URL from the Supabase dashboard.

### Development

```bash
# Start the development server
npm run dev
```

This will start the development server at http://localhost:5173 (or another port if 5173 is in use).

### Build

```bash
# Build for production
npm run build
```

The build output will be in the `dist` directory.

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter check
npm run lint

# Run linter and fix issues
npm run lint:fix

# Run prettier check
npm run prettier

# Run prettier and fix formatting
npm run prettier:fix

# Run type check
npm run typecheck

# Prepare husky (git hooks)
npm run prepare
```

## Application Usage

1. **View Todos**: The main page displays todos organized in three columns: To Do, In Progress, and Done.
2. **Create Todo**: Click the "Add Todo" button to create a new todo item.
3. **Move Todos**: Drag and drop todos between columns to change their status.
4. **Edit Todo**: Click on a todo to edit its details.
5. **Delete Todo**: Remove a todo when it's no longer needed.

## Browser Support

The application supports all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying, transferring, or reproduction of the contents of this project, via any medium, is strictly prohibited.
