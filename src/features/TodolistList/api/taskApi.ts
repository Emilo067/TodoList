import { instance } from "common/instance/instance";
import { ResponseType } from "common/types/ResponseType";
import { AddTaskArgType, GetTasksResponse, TaskType, UpdateTaskArgs } from "features/TodolistList/api/taskApi.types";

export const taskApi = {
  updateTask(args: UpdateTaskArgs) {
    return instance.put<ResponseType<{ item: TaskType }>>(
      `todo-lists/${args.todolistId}/tasks/${args.taskId}`,
      args.domainModel,
    );
  },
  deleteTask(args: { todolistId: string; taskId: string }) {
    return instance.delete<ResponseType>(`todo-lists/${args.todolistId}/tasks/${args.taskId}`);
  },
  getTasks(todolistId: string, currentPage?: number) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`, {
      params: { count: 5, page: currentPage },
    });
  },
  createTask(args: AddTaskArgType) {
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${args.todolistId}/tasks`, {
      title: args.title,
    });
  },
};
