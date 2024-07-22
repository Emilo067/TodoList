import { appActions } from "app/model/app.reducer";
import { ResponseType } from "common/types/ResponseType";
import { Dispatch } from "redux";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, showGlobalError: boolean = true) => {
  if (showGlobalError) {
    if (data.messages.length) {
      dispatch(appActions.setAppError({ error: data.messages[0] }));
    } else {
      dispatch(appActions.setAppError({ error: "Some error occurred" }));
    }
  }
};
