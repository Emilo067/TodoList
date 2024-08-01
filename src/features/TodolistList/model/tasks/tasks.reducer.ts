import { TasksStateType } from "app/ui/App";
import { todolistsActions, todolistsThunks } from "features/TodolistList/model/todolists/todolists.reducer";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/model/app.reducer";
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from "common/utils";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums/enums";
import { TodolistType } from "features/TodolistList/api/todolistApi.types";
import { AddTaskArgType, TaskType, UpdateTaskArgs } from "features/TodolistList/api/taskApi.types";
import { taskApi } from "features/TodolistList/api/taskApi";
import { tasksPaginatorThunks } from "features/Paginator/model/tasksPaginator.reducer";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl: TodolistType) => {
          state[tl.id] = [];
        });
      })
      .addCase(todolistsActions.clearData, (state, action) => {
        return {};
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(tasksPaginatorThunks.fetchTasksPage.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel };
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) tasks.splice(index, 1);
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      });
  },
});

export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string; totalCount: number }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkApi) => {
    const { dispatch } = thunkApi;

    return thunkTryCatch(thunkApi, async () => {
      const res = await taskApi.getTasks(todolistId);
      const tasks = res.data.items;
      const totalCount = res.data.totalCount;
      return { tasks, todolistId, totalCount };
    });
  },
);

const removeTask = createAppAsyncThunk<{ todolistId: string; taskId: string }, { todolistId: string; taskId: string }>(
  "tasks/removeTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "loading" }));
    return thunkTryCatch(thunkAPI, async () => {
      const res = await taskApi.deleteTask(arg);
      if (res.data.resultCode === ResultCode.success) {
        return arg;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    }).finally(() => {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "succeeded" }));
    });
  },
);

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>("tasks/addTask", (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "loading" }));
  return thunkTryCatch(thunkAPI, async () => {
    const res = await taskApi.createTask(arg);
    if (res.data.resultCode === ResultCode.success) {
      const task: TaskType = res.data.data.item;
      todolistsActions.changeTodolistEntityStatus({ id: task.todoListId, status: "succeeded" });
      return { task };
    } else {
      handleServerAppError(res.data, dispatch, false);
      return rejectWithValue(res.data);
    }
  }).finally(() => {
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.todolistId, status: "succeeded" }));
  });
});

const updateTask = createAppAsyncThunk<UpdateTaskArgs, UpdateTaskArgs>("tasks/updateTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;

  return thunkTryCatch(thunkAPI, async () => {
    const state = getState();
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
    if (!task) {
      dispatch(appActions.setAppError({ error: "Task not found" }));
      return rejectWithValue(null);
    }

    const apiModel: UpdateTaskDomainType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
    };
    const res = await taskApi.updateTask({
      todolistId: arg.todolistId,
      taskId: arg.taskId,
      domainModel: apiModel,
    });
    if (res.data.resultCode === ResultCode.success) {
      return arg;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

export const tasksReducer = slice.reducer;

export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };

export type UpdateTaskDomainType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
  completed?: boolean;
};
