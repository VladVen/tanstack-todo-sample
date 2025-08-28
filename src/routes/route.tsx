import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { SortableContext } from '@dnd-kit/sortable';

import PageContainer from '@/components/ui/page-container.tsx';
import { Button } from '@/components/ui/button';
import TodoColumn from '@/components/TodoColumn';
import TodoFormModal from '@/modals/TodoFormModal';
import { type TodoListType, StatusEnum } from '@/api/types';
import { useTodos } from '@/queries/todoQueries.ts';
import useModal from '@/hooks/useModal.ts';
import DndProvider from '@/providers/DndProvider';
import useDnd from '@/hooks/useDnd';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const createTodo = useModal(TodoFormModal);

  const {
    data: todos = {
      [StatusEnum.TO_DO]: [],
      [StatusEnum.IN_PROGRESS]: [],
      [StatusEnum.DONE]: [],
    },
    isLoading,
  } = useTodos();

  const handleModalOpen = useCallback(() => {
    createTodo.show();
  }, [createTodo]);

  return (
    <PageContainer
      header={{
        title: t('todo:title'),
        actions: <Button onClick={handleModalOpen}>{t('todo:addTodo')}</Button>,
      }}
      isLoading={isLoading}
    >
      <DndProvider todos={todos}>
        <TodoColumns todos={todos} />
      </DndProvider>
    </PageContainer>
  );
}

// Separate component to use the DndContext values
function TodoColumns({ todos }: { todos: TodoListType }) {
  const { t } = useTranslation();
  const { activeId, activeStatus, overStatus, getActiveTodo } = useDnd();

  return (
    <div className="flex gap-4">
      {Object.values(StatusEnum).map(status => {
        // Get the items for this column
        let columnItems = [...todos[status]];

        const activeTodo = getActiveTodo();

        // If we're dragging an item and it's over a different column
        if (activeId && activeStatus !== overStatus && activeTodo) {
          // If this is the source column, remove the active item
          if (status === activeStatus) {
            columnItems = columnItems.filter(todo => todo.id !== activeId);
          }

          // If this is the target column, add the active item
          if (status === overStatus) {
            columnItems = [...columnItems, { ...activeTodo, status }];
          }
        }

        return (
          <div key={status} className="flex-1">
            <SortableContext items={columnItems.map(todo => todo.id)}>
              <TodoColumn
                header={t(`todo:status.${status.toLowerCase()}`)}
                items={columnItems}
              />
            </SortableContext>
          </div>
        );
      })}
    </div>
  );
}
