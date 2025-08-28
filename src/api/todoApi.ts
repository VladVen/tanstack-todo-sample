import supabase from './apiClient';
import {
  type CreateTodoItem,
  type EditTodoItem,
  StatusEnum,
  type TodoItemType,
  type TodoListType,
} from './types';

/**
 * Fetches all todos from Supabase and organizes them by status
 * @returns A promise that resolves to the todos organized by status
 */
export const fetchTodos = async (): Promise<TodoListType> => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select<string, TodoItemType>(
        `
      id,
    title,
    description,
    status,
    priority,
    deadline,
    orderInColumn,
    file,
    createdAt,
    executor,
    user:executors ( id, name, email )
    `,
      )
      .order('orderInColumn', { ascending: true });

    if (error) {
      throw error;
    }

    // Initialize the result with empty arrays for each status
    const result: TodoListType = {
      [StatusEnum.TO_DO]: [],
      [StatusEnum.IN_PROGRESS]: [],
      [StatusEnum.DONE]: [],
    };

    // Organize todos by status
    data.forEach((todo: TodoItemType) => {
      result[todo.status].push(todo);
    });

    return result;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

/**
 * Creates a new todo in Supabase
 * @param todo The todo to create (without id and orderInColumn)
 * @param status The status of the todo
 * @returns A promise that resolves to the created todo
 */
export const createTodo = async (
  todo: CreateTodoItem,
  status: StatusEnum,
): Promise<TodoItemType> => {
  try {
    // Get the current count of todos in the specified status to determine orderInColumn
    const { count, error: countError } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);

    if (countError) {
      throw countError;
    }

    const orderInColumn = count || 0;

    // Create the new todo
    const { data, error } = await supabase
      .from('todos')
      .insert({
        ...todo,
        status,
        orderInColumn,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

/**
 * Updates an existing todo in Supabase
 * @param todo The todo to update
 * @returns A promise that resolves to the updated todo
 */
export const updateTodo = async (todo: EditTodoItem): Promise<TodoItemType> => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .update(todo)
      .eq('id', todo.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

/**
 * Moves a todo from one status to another in Supabase
 * @param todoId The ID of the todo to move
 * @param sourceStatus The current status of the todo
 * @param destinationStatus The new status of the todo
 * @returns A promise that resolves when the todo has been moved
 */
export const moveTodo = async (
  todoId: string,
  sourceStatus: StatusEnum,
  destinationStatus: StatusEnum,
): Promise<void> => {
  try {
    // Get the current count of todos in the destination status to determine orderInColumn
    const { count, error: countError } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('status', destinationStatus);

    if (countError) {
      throw countError;
    }

    const orderInColumn = count || 0;

    // Update the todo with the new status and orderInColumn
    const { error } = await supabase
      .from('todos')
      .update({
        status: destinationStatus,
        orderInColumn,
      })
      .eq('id', todoId);

    if (error) {
      throw error;
    }

    // Update the orderInColumn of todos in the source status
    await reorderSourceColumn(sourceStatus);
  } catch (error) {
    console.error('Error moving todo:', error);
    throw error;
  }
};

/**
 * Reorders todos within the same status column in Supabase
 * @param todoId The ID of the todo to reorder
 * @param status The status of the todo
 * @param newOrder The new order of the todo
 * @returns A promise that resolves when the todos have been reordered
 */
export const reorderTodo = async (
  todoId: string,
  status: StatusEnum,
  newOrder: number,
): Promise<void> => {
  try {
    // Get all todos in the status column
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('status', status)
      .order('orderInColumn', { ascending: true });

    if (error) {
      throw error;
    }

    // Find the current index of the todo
    const currentIndex = data.findIndex(todo => todo.id === todoId);
    if (currentIndex === -1) {
      throw new Error('Todo not found');
    }

    // Remove the todo from its current position
    const [todo] = data.splice(currentIndex, 1);

    // Insert it at the new position
    data.splice(newOrder, 0, todo);

    // Update the orderInColumn for all todos in the column
    const updates = data.map((todo, index) => ({
      id: todo.id,
      orderInColumn: index,
    }));

    // Use batch update to update all todos at once
    await batchUpdateTodos(updates);
  } catch (error) {
    console.error('Error reordering todo:', error);
    throw error;
  }
};

/**
 * Deletes a todo from Supabase
 * @param todoId The ID of the todo to delete
 * @param status The status of the todo
 * @returns A promise that resolves when the todo has been deleted
 */
export const deleteTodo = async (
  todoId: string,
  status: StatusEnum,
): Promise<void> => {
  try {
    const { error } = await supabase.from('todos').delete().eq('id', todoId);

    if (error) {
      throw error;
    }

    // Update the orderInColumn of todos in the status column
    await reorderSourceColumn(status);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

/**
 * Helper function to batch update multiple todos in a single request
 * @param updates Array of objects containing todo id and new orderInColumn
 */
const batchUpdateTodos = async (
  updates: Array<{ id: string; orderInColumn: number }>,
): Promise<void> => {
  try {
    // Prepare the data for upsert operation
    const upsertData = updates.map(update => ({
      id: update.id,
      orderInColumn: update.orderInColumn,
    }));

    // Use upsert to update all todos in a single request
    const { error } = await supabase
      .from('todos')
      .upsert(upsertData, { onConflict: 'id' });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error batch updating todos:', error);
    throw error;
  }
};

/**
 * Helper function to reorder todos in a column after a todo has been removed
 * @param status The status column to reorder
 */
const reorderSourceColumn = async (status: StatusEnum): Promise<void> => {
  try {
    // Get all todos in the source status
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('status', status)
      .order('orderInColumn', { ascending: true });

    if (error) {
      throw error;
    }

    // Prepare updates for batch operation
    const updates = data.map((todo, index) => ({
      id: todo.id,
      orderInColumn: index,
    }));

    // Use batch update to update all todos at once
    await batchUpdateTodos(updates);
  } catch (error) {
    console.error('Error reordering source column:', error);
    throw error;
  }
};
