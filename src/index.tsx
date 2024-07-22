import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "app/ui/App";
import { Provider } from "react-redux";
import { store } from "app/store/store";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import { TodolistsList } from "features/TodolistList/ui/TodolistList";
import { ErrorPage } from "common/components/ErrorPage/ErrorPage";
import { LoginAsync } from "features/auth/ui/login/Login.async";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Navigate to="404" />,
    children: [
      {
        index: true,
        element: <Navigate to="/todolists" />,
      },
      {
        path: "/login",
        element: <LoginAsync />,
      },
      {
        path: "/todolists",
        element: <TodolistsList />,
      },
    ],
  },
  {
    path: "404",
    element: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
