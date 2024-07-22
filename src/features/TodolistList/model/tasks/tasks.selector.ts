import { AppRootStateType } from "app/store/store";

export const selectTasks = (state: AppRootStateType) => state.tasks;
