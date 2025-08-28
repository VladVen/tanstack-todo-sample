import { useContext } from 'react';

import { DndProviderContext } from '@/providers/DndProvider';

/**
 * useDnd hook to access drag and drop functionality for todo items
 *
 * Example:
 * const { activeId, activeStatus, overStatus, getActiveTodo } = useDnd();
 */
const useDnd = () => {
  const context = useContext(DndProviderContext);

  if (!context) {
    throw new Error('useDnd must be used within a DndProvider');
  }

  return context;
};

export default useDnd;
