import { todolistApi } from "features/TodolistList/api/todolistApi";
import { RequestStatusType } from "app/model/app.reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from "common/utils";
import { TodolistType } from "features/TodolistList/api/todolistApi.types";
import { ResultCode } from "common/enums/enums";
import { tasksThunks } from "features/TodolistList/model/tasks/tasks.reducer";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todo = state.find((tl) => tl.id === action.payload.id);
      if (todo) {
        todo.filter = action.payload.filter;
      }
    },
    clearData: () => {
      return [];
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
      const todo = state.find((tl) => tl.id === action.payload.id);
      if (todo) {
        todo.entityStatus = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl: TodolistType) => {
          state.push({ ...tl, filter: "all", entityStatus: "idle" });
        });
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todolistId);
        if (index !== -1) {
          state.splice(index, 1);
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const todo = state.find((tl) => tl.id === action.payload.todolistId);
        if (todo) {
          todo.title = action.payload.title;
        }
      });
  },
});

const fetchTodolists = createAppAsyncThunk<
  {
    todolists: TodolistType[];
  },
  void
>(`${slice.name}/fetchTodolists`, async (_, thunkApi) => {
  const res = await todolistApi.getTodolists();
  thunkApi.dispatch(todolistsActions.clearData());
  const todolists = res.data;
  return { todolists };
});

export const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  `${slice.name}/removeTodolist`,
  async (todolistId, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
    const res = await todolistApi.deleteTodolist(todolistId).finally(() => {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "idle" }));
    });
    if (res.data.resultCode === ResultCode.success) {
      return { todolistId };
    } else {
      return rejectWithValue(null);
    }
  },
);

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  `${slice.name}/addTodolist`,
  async (title, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;

    return thunkTryCatch(thunkApi, async () => {
      const res = await todolistApi.createTodolist(title);
      if (res.data.resultCode === ResultCode.success) {
        const todolist = res.data.data.item;
        return { todolist };
      } else {
        handleServerAppError(res.data, dispatch, false);
        return rejectWithValue(res.data);
      }
    });
  },
);

export const changeTodolistTitle = createAppAsyncThunk<
  { todolistId: string; title: string },
  { todolistId: string; title: string }
>(`${slice.name}/changeTodolistTitle`, async (args, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  return thunkTryCatch(thunkApi, async () => {
    const res = await todolistApi.updateTodolist(args);
    if (res.data.resultCode === ResultCode.success) {
      return args;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle };

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
