import { todolistsActions } from "features/TodolistList/model/todolists/todolists.reducer";
import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/model/app.reducer";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { authApi, LoginParamsType } from "features/auth/api/auth.api";
import { createAppAsyncThunk, thunkTryCatch } from "common/utils";
import { ResultCode } from "common/enums/enums";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.initializeApp.fulfilled),
      (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      },
    );
  },
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${authSlice.name}/login`,
  async (arg, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;

    return thunkTryCatch(thunkApi, async () => {
      const res = await authApi.login(arg);
      if (res.data.resultCode === 0) {
        return { isLoggedIn: true };
      } else {
        const isShowAppError = !res.data.fieldsErrors.length;
        handleServerAppError(res.data, dispatch, isShowAppError);
        return rejectWithValue(res.data);
      }
    });
  },
);

const logout = createAppAsyncThunk<
  {
    isLoggedIn: boolean;
  },
  undefined
>(`${authSlice.name}/logout`, async (args, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;

  return thunkTryCatch(thunkApi, async () => {
    const res = await authApi.logout();
    if (res.data.resultCode === 0) {
      dispatch(todolistsActions.clearData());
      return { isLoggedIn: false };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${authSlice.name}/initializeApp`,
  async (_, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;

    return thunkTryCatch(thunkApi, async () => {
      const res = await authApi.me();
      if (res.data.resultCode === ResultCode.success) {
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    }).finally(() => {
      dispatch(appActions.setAppIsInitialized({ isInitialized: true }));
      console.log("finally auth");
    });
  },
);

export const authReducer = authSlice.reducer;
export const authThunks = { login, logout, initializeApp };
