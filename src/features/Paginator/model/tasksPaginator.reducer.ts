import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tasksThunks } from "features/TodolistList/model/tasks/tasks.reducer";
import { createAppAsyncThunk, thunkTryCatch } from "common/utils";
import { taskApi } from "features/TodolistList/api/taskApi";
import { TaskType } from "features/TodolistList/api/taskApi.types";

type TasksPaginator = {
  [key: string]: {
    totalCount: number;
    currentPage: number;
  };
};

const slice = createSlice({
  name: "tasksPaginator",
  initialState: {} as TasksPaginator,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<{ currentPage: number; todolistId: string }>) => {
      state[action.payload.todolistId].currentPage = action.payload.currentPage;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(tasksThunks.fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = { totalCount: action.payload.totalCount, currentPage: 1 };
    });
  },
});

export const fetchTasksPage = createAppAsyncThunk<
  { currentPage: number; todolistId: string; tasks: TaskType[] },
  { currentPage: number; todolistId: string }
>("tasks/fetchTasksPage", async (args, thunkApi) => {
  const { dispatch } = thunkApi;
  const { currentPage, todolistId } = args;
  dispatch(setCurrentPage({ currentPage, todolistId }));
  return thunkTryCatch(thunkApi, async () => {
    const res = await taskApi.getTasks(args.todolistId, args.currentPage);
    const tasks = res.data.items;
    return { todolistId, currentPage, tasks };
  });
});

export const tasksPaginatorReducer = slice.reducer;
export const tasksPaginatorThunks = { fetchTasksPage };
export const { setCurrentPage } = slice.actions;
