import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { type QueryClient } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { LanguageToggle } from '@/components/ui/language-toggle.tsx';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import NotFoundComponent from '@/components/NotFoundComponent';

const RootRouter = () => {
  return (
    <>
      <div className={'flex py-2 pr-4 justify-end items-center'}>
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="z-2">
        <Outlet />
      </div>
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootRouter,
  notFoundComponent: () => {
    return <NotFoundComponent />;
  },
});
