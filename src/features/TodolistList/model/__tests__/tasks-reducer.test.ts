import { TasksStateType } from "app/App";
import { todolistsThunks } from "features/TodolistList/model/todolists/todolists.reducer";
import { tasksReducer, tasksThunks } from "features/TodolistList/model/tasks/tasks.reducer";
import { ActionTypeForTest } from "common/types/ActionTypeForTest";
import { TaskPriorities, TaskStatuses } from "common/enums/enums";
import { TodolistType } from "features/TodolistList/api/todolistApi.types";

let startState: TasksStateType;

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        description: "test task",
        completed: false,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        description: "test task",
        completed: false,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        description: "test task",
        completed: false,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        description: "test task",
        completed: false,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        description: "test task",
        completed: false,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        description: "test task",
        completed: false,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const action: ActionTypeForTest<typeof tasksThunks.removeTask.fulfilled> = {
    type: tasksThunks.removeTask.fulfilled.type,
    payload: {
      todolistId: "todolistId2",
      taskId: "2",
    },
  };

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every((t) => t.id !== "2")).toBeTruthy();
});

test("correct task should be added to correct array", () => {
  const action: ActionTypeForTest<typeof tasksThunks.addTask.fulfilled> = {
    type: tasksThunks.addTask.fulfilled.type,
    payload: {
      task: {
        todoListId: "todolistId2",
        title: "juice",
        status: TaskStatuses.New,
        completed: false,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: 0,
        startDate: "",
        id: "id exists",
      },
    },
  };

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juice");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified task should be changed", () => {
  const action: ActionTypeForTest<typeof tasksThunks.updateTask.fulfilled> = {
    type: tasksThunks.updateTask.fulfilled.type,
    payload: {
      taskId: "2",
      domainModel: { status: TaskStatuses.New },
      todolistId: "todolistId2",
    },
  };

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});

test("title of specified task should be changed", () => {
  const action: ActionTypeForTest<typeof tasksThunks.updateTask.fulfilled> = {
    type: tasksThunks.updateTask.fulfilled.type,
    payload: {
      taskId: "2",
      domainModel: { title: "yogurt" },
      todolistId: "todolistId2",
    },
  };

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("yogurt");
  expect(endState["todolistId2"][0].title).toBe("bread");
});

test("new array should be added when new todolist is added", () => {
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

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("property with todolistId should be deleted", () => {
  const action: ActionTypeForTest<typeof todolistsThunks.removeTodolist.fulfilled> = {
    type: todolistsThunks.removeTodolist.fulfilled.type,
    payload: {
      todolistId: "todolistId2",
    },
  };

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});

test("empty arrays should be added when we set todolists", () => {
  const action: ActionTypeForTest<typeof todolistsThunks.fetchTodolists.fulfilled> = {
    type: todolistsThunks.fetchTodolists.fulfilled.type,
    payload: {
      todolists: [
        { id: "todolistId1", title: "What to learn", order: 0, addedDate: "" },
        { id: "todolistId2", title: "What to buy", order: 0, addedDate: "" },
      ],
    },
  };
  // const action = todolistsActions.setTodolists({
  //   todolists: [
  //     { id: "todolistId1", title: "What to learn", order: 0, addedDate: "" },
  //     { id: "todolistId2", title: "What to buy", order: 0, addedDate: "" },
  //   ],
  // });

  const endState = tasksReducer({}, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["todolistId1"]).toStrictEqual([]);
  expect(endState["todolistId2"]).toStrictEqual([]);
});

test("tasks should be added for todolists", () => {
  const action: ActionTypeForTest<typeof tasksThunks.fetchTasks.fulfilled> = {
    type: tasksThunks.fetchTasks.fulfilled.type,
    payload: { tasks: startState["todolistId1"], todolistId: "todolistId1" },
  };

  // <T extends (...args: any) => any> означает, что T должен быть функцией, принимающей любое количество аргументов и возвращающей какое-либо значение.

  const endState = tasksReducer(
    {
      todolistId1: [],
      todolistId2: [],
    },
    action,
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toStrictEqual(0);
});
