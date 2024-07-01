import { todolistApi } from "features/TodolistList/api/todolistApi";
import { appActions, RequestStatusType } from "app/app.reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from "common/utils";
import { TodolistType } from "features/TodolistList/api/todolistApi.types";
import { ResultCode } from "common/enums/enums";

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
    clearData: (state, action: PayloadAction) => {
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
        debugger;
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
  const { dispatch, rejectWithValue } = thunkApi;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistApi.getTodolists();
    const todolists = res.data;
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    debugger;
    return { todolists };
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  `${slice.name}/removeTodolist`,
  async (todolistId, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await todolistApi.deleteTodolist(todolistId);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  `${slice.name}/addTodolist`,
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    return thunkTryCatch(thunkAPI, async () => {
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
>(`${slice.name}/changeTodolistTitle`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistApi.updateTodolist(args);
    if (res.data.resultCode === ResultCode.success) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return args;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle };

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

// export const fetchTodolists = createAppAsyncThunk<{
//   todolists: TodolistType[];
// }>(`${slice.name}/fetchTodolists`, async (args, thunkAPI) => {
//   const { dispatch, rejectWithValue } = thunkAPI;
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   try {
//     const res = await todolistApi.getTodolists();
//     dispatch(appActions.setAppStatus({ status: "succeeded" }));
//     return { res };
//   } catch (error) {
//     handleServerNetworkError(error, dispatch);
//     return rejectWithValue(null);
//   }
// });

// export const changeTodolistTitleTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   try {
//     const res = await todolistApi.updateTodolist(todolistId, title);
//     if (res.data.resultCode === ResultCode.success) {
//       dispatch(todolistsActions.changeTodolistTitle({ id: todolistId, title }));
//       dispatch(appActions.setAppStatus({ status: "succeeded" }));
//     } else {
//       handleServerAppError(res.data, dispatch);
//     }
//   } catch (e: any) {
//     handleServerNetworkError(e, dispatch);
//   }
// };
