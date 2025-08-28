import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchTodos,
  createTodo,
  updateTodo,
  moveTodo,
  reorderTodo,
  deleteTodo,
} from '@/api/todoApi.ts';
import type {
  StatusEnum,
  EditTodoItem,
  TodoItemType,
  TodoListType,
  CreateTodoItem,
} from '@/api/types.ts';

// Query key for todos
const TODOS_QUERY_KEY = ['todos'];

/**
 * Hook to fetch all todos
 */
export const useTodos = () => {
  return useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: fetchTodos,
  });
};

/**
 * Hook to create a new todo
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      todo,
      status,
    }: {
      todo: CreateTodoItem;
      status: StatusEnum;
    }) => createTodo(todo, status),
    onMutate: async ({ todo, status }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY });

      // Snapshot the previous value
      const previousTodos =
        queryClient.getQueryData<TodoListType>(TODOS_QUERY_KEY);

      // Return a context object with the snapshot value
      if (!previousTodos) {
        return { previousTodos: null };
      }

      // Optimistically update the cache
      queryClient.setQueryData<TodoListType>(TODOS_QUERY_KEY, old => {
        if (!old) {
          return previousTodos;
        }

        // Create a deep copy of the todos
        const newTodos = JSON.parse(JSON.stringify(old)) as TodoListType;

        // Create a temporary ID for the new todo
        const tempId = `temp-${Date.now()}`;

        // Create the new todo with the temporary ID and add it to the appropriate column
        const newTodo: TodoItemType = {
          ...todo,
          id: tempId,
          status,
          orderInColumn: newTodos[status].length,
        } as TodoItemType;

        newTodos[status].push(newTodo);

        return newTodos;
      });

      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};

/**
 * Hook to update an existing todo
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo: EditTodoItem) => updateTodo(todo),
    onMutate: async updatedTodo => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY });

      // Snapshot the previous value
      const previousTodos =
        queryClient.getQueryData<TodoListType>(TODOS_QUERY_KEY);

      // Return a context object with the snapshot value
      if (!previousTodos) {
        return { previousTodos: null };
      }

      // Optimistically update the cache
      queryClient.setQueryData<TodoListType>(TODOS_QUERY_KEY, old => {
        if (!old) {
          return previousTodos;
        }

        // Create a deep copy of the todos
        const newTodos = JSON.parse(JSON.stringify(old)) as TodoListType;

        // Find the todo in its column
        const todoIndex = newTodos[updatedTodo.status].findIndex(
          todo => todo.id === updatedTodo.id,
        );
        if (todoIndex === -1) {
          return old;
        }

        const oldTodo = newTodos[updatedTodo.status][todoIndex];

        // Update the todo
        newTodos[updatedTodo.status][todoIndex] = {
          ...oldTodo,
          ...updatedTodo,
        };

        return newTodos;
      });

      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};

/**
 * Hook to move a todo from one status to another
 */
export const useMoveTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      todoId,
      sourceStatus,
      destinationStatus,
    }: {
      todoId: string;
      sourceStatus: StatusEnum;
      destinationStatus: StatusEnum;
    }) => moveTodo(todoId, sourceStatus, destinationStatus),
    onMutate: async ({ todoId, sourceStatus, destinationStatus }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY });

      // Snapshot the previous value
      const previousTodos =
        queryClient.getQueryData<TodoListType>(TODOS_QUERY_KEY);

      // Return a context object with the snapshot value
      if (!previousTodos) {
        return { previousTodos: null };
      }

      // Optimistically update the cache
      queryClient.setQueryData<TodoListType>(TODOS_QUERY_KEY, old => {
        if (!old) {
          return previousTodos;
        }

        // Create a deep copy of the todos
        const newTodos = JSON.parse(JSON.stringify(old)) as TodoListType;

        // Find the todo in the source column
        const todoIndex = newTodos[sourceStatus].findIndex(
          todo => todo.id === todoId,
        );
        if (todoIndex === -1) {
          return old;
        }

        // Remove the todo from the source column
        const [todo] = newTodos[sourceStatus].splice(todoIndex, 1);

        // Add the todo to the destination column with the new status and at the end
        const updatedTodo = {
          ...todo,
          status: destinationStatus,
          orderInColumn: newTodos[destinationStatus].length,
        };
        newTodos[destinationStatus].push(updatedTodo);

        // Update the orderInColumn for all todos in the source column
        newTodos[sourceStatus].forEach((todo, index) => {
          todo.orderInColumn = index;
        });

        return newTodos;
      });

      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};

/**
 * Hook to reorder todos within the same status column
 */
export const useReorderTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      todoId,
      status,
      newOrder,
    }: {
      todoId: string;
      status: StatusEnum;
      newOrder: number;
    }) => reorderTodo(todoId, status, newOrder),
    onMutate: async ({ todoId, status, newOrder }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY });

      // Snapshot the previous value
      const previousTodos =
        queryClient.getQueryData<TodoListType>(TODOS_QUERY_KEY);

      // Return a context object with the snapshot value
      if (!previousTodos) {
        return { previousTodos: null };
      }

      // Optimistically update the cache
      queryClient.setQueryData<TodoListType>(TODOS_QUERY_KEY, old => {
        if (!old) {
          return previousTodos;
        }

        // Create a deep copy of the todos
        const newTodos = JSON.parse(JSON.stringify(old)) as TodoListType;

        // Find the current index of the todo
        const currentIndex = newTodos[status].findIndex(
          todo => todo.id === todoId,
        );
        if (currentIndex === -1) {
          return old;
        }

        // Remove the todo from its current position
        const [todo] = newTodos[status].splice(currentIndex, 1);

        // Insert it at the new position
        newTodos[status].splice(newOrder, 0, todo);

        // Update the orderInColumn for all todos in the column
        newTodos[status].forEach((todo, index) => {
          todo.orderInColumn = index;
        });

        return newTodos;
      });

      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};

/**
 * Hook to delete a todo
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ todoId, status }: { todoId: string; status: StatusEnum }) =>
      deleteTodo(todoId, status),
    onMutate: async ({ todoId, status }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY });

      // Snapshot the previous value
      const previousTodos =
        queryClient.getQueryData<TodoListType>(TODOS_QUERY_KEY);

      // Return a context object with the snapshot value
      if (!previousTodos) {
        return { previousTodos: null };
      }

      // Optimistically update the cache
      queryClient.setQueryData<TodoListType>(TODOS_QUERY_KEY, old => {
        if (!old) {
          return previousTodos;
        }

        // Create a deep copy of the todos
        const newTodos = JSON.parse(JSON.stringify(old)) as TodoListType;

        // Find the todo in its column
        const todoIndex = newTodos[status].findIndex(
          todo => todo.id === todoId,
        );
        if (todoIndex === -1) {
          return old;
        }

        // Remove the todo
        newTodos[status].splice(todoIndex, 1);

        // Update the orderInColumn for all todos in the column
        newTodos[status].forEach((todo, index) => {
          todo.orderInColumn = index;
        });

        return newTodos;
      });

      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};
