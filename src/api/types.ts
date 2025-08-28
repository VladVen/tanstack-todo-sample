export enum StatusEnum {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum PriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface ExecutorType {
  id: string;
  name: string;
  email: string;
}

export interface TodoItemType {
  id: string;
  title: string;
  description?: string;
  file?: string | null;
  status: StatusEnum;
  createdAt: string;
  priority: PriorityEnum;
  deadline: string;
  executor?: string | null;
  orderInColumn: number;
  user?: ExecutorType;
}

export type EditTodoItem = Omit<TodoItemType, 'createdAt' | 'user'>;
export type CreateTodoItem = Omit<
  TodoItemType,
  'createdAt' | 'id' | 'orderInColumn' | 'user'
>;

export interface TodoListType {
  [StatusEnum.TO_DO]: TodoItemType[];
  [StatusEnum.IN_PROGRESS]: TodoItemType[];
  [StatusEnum.DONE]: TodoItemType[];
}
