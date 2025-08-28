import { QueryClient } from '@tanstack/react-query';

const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 0,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default appQueryClient;
