import React, { useCallback, useMemo, useState, useRef } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import { StatusEnum, type TodoItemType, type TodoListType } from '@/api/types';
import { useMoveTodo, useReorderTodo } from '@/queries/todoQueries.ts';

type Props = {
  children: React.ReactNode;
  todos: TodoListType;
};

// Type for context value
type DndContextValue = {
  activeId: string | null;
  activeStatus: StatusEnum | null;
  overStatus: StatusEnum | null;
  getActiveTodo: () => TodoItemType | null;
};

export const DndProviderContext = React.createContext<DndContextValue>(
  {} as DndContextValue,
);

/**
 * DndProvider to handle drag and drop functionality for todo items
 */
const DndProvider = ({ children, todos }: Props) => {
  // State to track the active drag item and its position
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<StatusEnum | null>(null);
  const [overStatus, setOverStatus] = useState<StatusEnum | null>(null);

  const { mutate: moveTodoMutate } = useMoveTodo();
  const { mutate: reorderTodoMutate } = useReorderTodo();

  // Store pending move operation during drag
  const pendingMoveRef = useRef<{
    todoId: string;
    sourceStatus: StatusEnum;
    destinationStatus: StatusEnum;
  } | null>(null);

  // Helper function to find the status of a todo by ID
  const findTodoStatus = useCallback(
    (todoId: string): StatusEnum | null => {
      for (const status of Object.values(StatusEnum)) {
        if (todos[status].some(todo => todo.id === todoId)) {
          return status;
        }
      }
      return null;
    },
    [todos],
  );

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance before activation
      },
    }),
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      // Clear any pending operations when a new drag starts
      pendingMoveRef.current = null;

      const id = event.active.id as string;
      const status = findTodoStatus(id);

      // Set the active item and its status
      setActiveId(id);
      setActiveStatus(status);
      setOverStatus(status);
    },
    [findTodoStatus],
  );

  // Handle drag over (when dragging over a different column)
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over) {
        return;
      }

      // Extract IDs
      const activeId = active.id as string;
      const overId = over.id as string;

      // Find the status of the active item
      const currentActiveStatus = findTodoStatus(activeId);
      if (!currentActiveStatus) {
        return;
      }

      // Find the status of the over item
      let currentOverStatus: StatusEnum | null = null;

      Object.values(StatusEnum).forEach(status => {
        // Check if the column itself is being dragged over
        if (status === overId) {
          currentOverStatus = status;
          return;
        }

        // Check if an item in the column is being dragged over
        if (todos[status].some(todo => todo.id === overId)) {
          currentOverStatus = status;
        }
      });

      // If not dragging over a valid target or same column, do nothing
      if (!currentOverStatus || currentActiveStatus === currentOverStatus) {
        return;
      }

      // Update the over status state
      setOverStatus(currentOverStatus);

      // Store the pending move operation instead of executing it immediately
      pendingMoveRef.current = {
        todoId: activeId,
        sourceStatus: currentActiveStatus,
        destinationStatus: currentOverStatus,
      };
    },
    [findTodoStatus, todos],
  );

  // Handle drag end (for reordering within the same column)
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      // Reset the active item state
      setActiveId(null);
      setActiveStatus(null);
      setOverStatus(null);

      // Check if we have a pending move operation from handleDragOver
      if (pendingMoveRef.current) {
        // Execute the pending move operation now that the drag is complete
        moveTodoMutate(pendingMoveRef.current);
        // Clear the pending operation
        pendingMoveRef.current = null;
        return;
      }

      if (!over) {
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;

      // Find the status of the active item
      const currentActiveStatus = findTodoStatus(activeId);
      if (!currentActiveStatus) {
        return;
      }

      // Check if the over item is in the same column
      const currentOverStatus = findTodoStatus(overId);
      if (currentOverStatus !== currentActiveStatus) {
        return; // Different columns are handled by handleDragOver
      }

      // Find the indices of the active and over items
      const activeIndex = todos[currentActiveStatus].findIndex(
        todo => todo.id === activeId,
      );
      const overIndex = todos[currentActiveStatus].findIndex(
        todo => todo.id === overId,
      );

      // If the indices are different, reorder the items
      if (activeIndex !== overIndex) {
        reorderTodoMutate({
          todoId: activeId,
          status: currentActiveStatus,
          newOrder: overIndex,
        });
      }
    },
    [findTodoStatus, moveTodoMutate, reorderTodoMutate, todos],
  );

  // Function to get the active todo item
  const getActiveTodo = useCallback(() => {
    if (!activeId || !activeStatus) {
      return null;
    }
    return todos[activeStatus].find(todo => todo.id === activeId) || null;
  }, [activeId, activeStatus, todos]);

  // Value for context provider
  const value = useMemo(
    () => ({
      activeId,
      activeStatus,
      overStatus,
      getActiveTodo,
    }),
    [activeId, activeStatus, overStatus, getActiveTodo],
  );

  return (
    <DndProviderContext.Provider value={value}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DndContext>
    </DndProviderContext.Provider>
  );
};

export default React.memo(DndProvider);
