import { instance } from "common/instance/instance";
import { ResponseType } from "common/types/ResponseType";
import { TodolistType } from "features/TodolistList/api/todolistApi.types";

export const todolistApi = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  updateTodolist(args: { todolistId: string; title: string }) {
    return instance.put<ResponseType>(`todo-lists/${args.todolistId}`, { title: args.title });
  },

  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title });
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`);
  },
};
