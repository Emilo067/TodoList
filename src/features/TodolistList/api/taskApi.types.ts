import { UpdateTaskDomainType } from "features/TodolistList/model/tasks/tasks.reducer";
import { TaskPriorities, TaskStatuses } from "common/enums/enums";

export type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};

export type AddTaskArgType = {
  todolistId: string;
  title: string;
};

export type UpdateTaskArgs = {
  todolistId: string;
  taskId: string;
  domainModel: UpdateTaskDomainType;
};

export type TaskType = {
  description: string;
  title: string;
  completed: boolean;
  status: number;
  priority: number;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};

export type UpdateTaskModel = {
  title: string;
  description: string;
  completed: boolean;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
