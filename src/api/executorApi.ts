import supabase from './apiClient';
import { type ExecutorType } from './types';

/**
 * Fetches all executors from Supabase
 * @returns A promise that resolves to an array of executors
 */
export const fetchExecutors = async (): Promise<ExecutorType[]> => {
  try {
    const { data, error } = await supabase
      .from('executors')
      .select<string, ExecutorType>('id, name, email')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching executors:', error);
    throw error;
  }
};
