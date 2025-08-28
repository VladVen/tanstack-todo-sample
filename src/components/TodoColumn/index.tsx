import { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';

import TodoItem from '@/components/TodoColumn/components/TodoItem';
import { StatusEnum, type TodoItemType } from '@/api/types.ts';

type Props = {
  items: Array<TodoItemType>;
  header: string;
};

const TodoColumn = (props: Props) => {
  const { items, header } = props;

  // Get the status from the first item or default to TO_DO
  const status = items.length > 0 ? items[0].status : StatusEnum.TO_DO;

  // Set up droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="text-lg font-semibold mb-3 px-2">{header}</div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 rounded-md min-h-[400px] transition-all ${
          isOver ? 'bg-muted-foreground' : 'bg-muted'
        }`}
      >
        {items.map(item => (
          <TodoItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default memo(TodoColumn);
