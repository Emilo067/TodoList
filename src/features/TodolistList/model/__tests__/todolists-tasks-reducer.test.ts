import { TasksStateType } from "app/App";
import {
  TodolistDomainType,
  todolistsReducer,
  todolistsThunks,
} from "features/TodolistList/model/todolists/todolists.reducer";
import { tasksReducer } from "features/TodolistList/model/tasks/tasks.reducer";
import { ActionTypeForTest } from "common/types/ActionTypeForTest";
import { TodolistType } from "features/TodolistList/api/todolistApi.types";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  const newTodolist: TodolistType = {
    title: "New Todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };

  const action: ActionTypeForTest<typeof todolistsThunks.addTodolist.fulfilled> = {
    type: todolistsThunks.addTodolist.fulfilled.type,
    payload: {
      todolist: newTodolist,
    },
  };

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
