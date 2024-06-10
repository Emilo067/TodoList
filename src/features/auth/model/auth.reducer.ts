import { todolistsActions } from "features/TodolistList/model/todolists/todolists.reducer";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app.reducer";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { authApi, LoginParamsType } from "features/auth/api/auth.api";
import { createAppAsyncThunk } from "common/utils";
import { ResultCode } from "common/enums/enums";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await authApi.login(arg);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        const isShowAppError = !res.data.fieldsErrors.length;
        handleServerAppError(res.data, dispatch, isShowAppError);
        return rejectWithValue(res.data);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

// const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
//   `${slice.name}/login`,
//   async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI;
//     try {
//       dispatch(appActions.setAppStatus({ status: "loading" }));
//       const res = await authApi.login(arg);
//       if (res.data.resultCode === 0) {
//         dispatch(appActions.setAppStatus({ status: "succeeded" }));
//         return { isLoggedIn: true };
//       } else {
//         // const showGlobalError = !res.data.fieldsErrors.length;
//         handleServerAppError(res.data, dispatch);
//         return rejectWithValue(null);
//       }
//     } catch (e) {
//       handleServerNetworkError(e, dispatch);
//       return rejectWithValue(null);
//     }
//   },
// );

const logout = createAppAsyncThunk<
  {
    isLoggedIn: boolean;
  },
  undefined
>(`${slice.name}/logout`, async (args, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authApi.logout();
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(todolistsActions.clearData());
      return { isLoggedIn: false };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authApi.me();
      if (res.data.resultCode === ResultCode.success) {
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppIsInitialized({ isInitialized: true }));
    }
  },
);

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
