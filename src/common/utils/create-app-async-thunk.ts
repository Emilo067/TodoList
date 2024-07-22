import { AppDispatch, AppRootStateType } from "app/store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseType } from "common/types/ResponseType";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: null | ResponseType;
}>();
