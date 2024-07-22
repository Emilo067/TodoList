import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "features/TodolistList/model/tasks/tasks.reducer";
import { todolistsReducer } from "features/TodolistList/model/todolists/todolists.reducer";
import { appReducer } from "app/model/app.reducer";
import { authReducer } from "features/auth/model/auth.reducer";
import { tasksPaginatorReducer } from "features/Paginator/model/tasksPaginator.reducer";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    tasksPaginator: tasksPaginatorReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;

// @ts-ignore
window.store = store;
