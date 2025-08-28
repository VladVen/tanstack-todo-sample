import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  ChevronsUp,
  ChevronUp,
  Image as ImageIcon,
} from 'lucide-react';

import TodoFormModal from '@/modals/TodoFormModal';
import { PriorityEnum, type TodoItemType } from '@/api/types.ts';
import useModal from '@/hooks/useModal.ts';

const priorityOptions = {
  [PriorityEnum.LOW]: <ChevronDown className="text-green-500 inline" />,
  [PriorityEnum.MEDIUM]: <ChevronUp className="text-orange-500 inline" />,
  [PriorityEnum.HIGH]: <ChevronsUp className="text-red-500 inline" />,
};

const TodoItem = (props: TodoItemType) => {
  const { title, id, priority, deadline, file } = props;
  const { t } = useTranslation();

  // Set up sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const todoForm = useModal(TodoFormModal);

  const handleModalOpen = useCallback(() => {
    todoForm.show({ initialData: props });
  }, [todoForm, props]);

  // Apply styles for dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      onClick={handleModalOpen}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 mb-2 bg-card rounded shadow cursor-grab border border-card hover:border-card-foreground"
    >
      <div className="font-medium">{title}</div>

      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        <div>
          {t('todo:todoItem.priority')}: {priorityOptions[priority]}
        </div>
        <div className="flex items-center gap-2">
          {file && <ImageIcon size={16} className="text-blue-500" />}
          {deadline && (
            <div>
              {t('todo:todoItem.due')}:{' '}
              {new Date(deadline).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TodoItem);
