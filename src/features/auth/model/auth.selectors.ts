import { AppRootStateType } from "app/store/store";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
