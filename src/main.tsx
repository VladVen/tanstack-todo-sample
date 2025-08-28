import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { Toaster } from '@/components/ui/sonner.tsx';
import NotFoundComponent from '@/components/NotFoundComponent';
import ErrorBoundary from '@/components/ErrorBoundary';
import appQueryClient from '@/queries';

import { routeTree } from './routeTree.gen';
import { ThemeProvider } from './components/theme/theme-provider';
import './i18n';
import './index.css';
import ModalProvider from './providers/ModalProvider';

export const router = createRouter({
  routeTree,
  context: {
    queryClient: appQueryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultNotFoundComponent: () => {
    return <NotFoundComponent />;
  },
  defaultErrorComponent: error => {
    return <ErrorBoundary {...error} />;
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={appQueryClient}>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <ModalProvider>
            <RouterProvider router={router} />
            <Toaster />
          </ModalProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
