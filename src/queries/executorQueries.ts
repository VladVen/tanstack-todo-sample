import { useQuery } from '@tanstack/react-query';

import { fetchExecutors } from '@/api/executorApi.ts';
import type { ExecutorType } from '@/api/types.ts';

// Query key for executors
const EXECUTORS_QUERY_KEY = ['executors'];

/**
 * Hook to fetch all executors
 */
export const useExecutors = () => {
  return useQuery<ExecutorType[]>({
    queryKey: EXECUTORS_QUERY_KEY,
    queryFn: fetchExecutors,
  });
};
