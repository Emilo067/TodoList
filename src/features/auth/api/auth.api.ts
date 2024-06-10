import { instance } from "common/instance/instance";
import { ResponseType } from "common/types/ResponseType";

export const authApi = {
  login(params: LoginParamsType) {
    return instance.post<ResponseType<{ userId: number }>>("auth/login", params);
  },
  me() {
    return instance.get<ResponseType<{ id: number; email: string; login: string }>>("auth/me");
  },
  logout() {
    return instance.delete<ResponseType>("auth/login");
  },
};

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: boolean;
};
