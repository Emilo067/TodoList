import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store/store";
import { selectIsLoggedIn } from "features/auth/model/auth.selectors";
import { FormikHelpers, useFormik } from "formik";
import { LoginParamsType } from "features/auth/api/auth.api";
import { authThunks } from "features/auth/model/auth.reducer";
import { ResponseType } from "common/types/ResponseType";

//type FormikErrorType = Omit<Partial<LoginParamsType>, "captcha">;

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector<AppRootStateType, boolean>(selectIsLoggedIn);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      // const errors: FormikErrorType = {};
      // if (!values.email) {
      //   errors.email = "Required";
      // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      //   errors.email = "Invalid email address";
      // }
      // if (!values.password) {
      //   errors.password = "Required";
      // } else if (values.password.length < 6) {
      //   errors.password = "Invalid password ";
      // }
      // return errors;
    },
    onSubmit: (values: LoginParamsType, formikHelpers: FormikHelpers<LoginParamsType>) => {
      dispatch(authThunks.login(values))
        .unwrap()
        .then((res) => {})
        .catch((error: ResponseType) => {
          error.fieldsErrors.forEach((err) => {
            formikHelpers.setFieldError(err.field, err.error);
          });
        });
      formik.resetForm();
    },
  });

  return {
    isLoggedIn,
    formik,
  };
};
