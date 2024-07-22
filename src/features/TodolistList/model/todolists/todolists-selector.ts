import { AppRootStateType } from "app/store/store";

export const selectTodolists = (state: AppRootStateType) => state.todolists;
