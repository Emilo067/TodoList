import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todolistsReducer,
  todolistsThunks,
} from "features/TodolistList/model/todolists/todolists.reducer";
import { v1 } from "uuid";
import { ActionTypeForTest } from "common/types/ActionTypeForTest";
import { TodolistType } from "features/TodolistList/api/todolistApi.types";

let todolistId1: string;
let todolistId2: string;
let startState: TodolistDomainType[];

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = [
    { id: todolistId1, title: "What to learn", filter: "all", order: 0, addedDate: "", entityStatus: "idle" },
    { id: todolistId2, title: "What to buy", filter: "all", order: 0, addedDate: "", entityStatus: "idle" },
  ];
});

test("correct todolist should be removed", () => {
  const action: ActionTypeForTest<typeof todolistsThunks.removeTodolist.fulfilled> = {
    type: todolistsThunks.removeTodolist.fulfilled.type,
    payload: {
      todolistId: todolistId1,
    },
  };
  // 2. Действие
  const endState = todolistsReducer(startState, action);

  // 3. Проверяем, что наши действия (изменения state) соответствуют ожиданию
  // в массиве останется один тудулист
  // expect(endState.length).toBe(1);
  // удалится нужный тудулист, а не любой
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
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

  const endState = todolistsReducer(startState, action);

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodolist.title);
  expect(endState[0].filter).toBe("all");
});

test("correct todolist should change its name", () => {
  const action: ActionTypeForTest<typeof todolistsThunks.changeTodolistTitle.fulfilled> = {
    type: todolistsThunks.fetchTodolists.fulfilled.type,
    payload: {
      todolistId: todolistId2,
      title: "Test Title",
    },
  };
  const endState = todolistsReducer(startState, action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe("Test Title");
});

test("correct filter of todolist should be changed", () => {
  const filter: FilterValuesType = "completed";
  const endState = todolistsReducer(startState, todolistsActions.changeTodolistFilter({ id: todolistId2, filter }));

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(filter);
});

test("todolist should be set to the state", () => {
  const action: ActionTypeForTest<typeof todolistsThunks.fetchTodolists.fulfilled> = {
    type: todolistsThunks.fetchTodolists.fulfilled.type,
    payload: {
      todolists: startState,
    },
  };
  const endState = todolistsReducer([], action);

  expect(endState.length).toBe(2);
});
