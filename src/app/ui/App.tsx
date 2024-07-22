import React, { useEffect, useState } from "react";
import "app/ui/App.css";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "app/store/store";
import { CircularProgress } from "@mui/material";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { Outlet } from "react-router-dom";
import { authThunks } from "features/auth/model/auth.reducer";
import { selectIsInitialized } from "app/model/app.selectors";
import { TaskType } from "features/TodolistList/api/taskApi.types";
import { LOCAL_STORAGE_THEME_KEY } from "shared/const/common";
import { ThemeAppProvider, ThemeMode } from "common/providers/ThemeProvider/ThemeAppProvider";
import { Header } from "widgets/Header/Header";

export type TasksStateType = {
  [key: string]: TaskType[];
};

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const isInitialized = useSelector<AppRootStateType, boolean>(selectIsInitialized);
  const dispatch = useDispatch();

  const defaultTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as ThemeMode;
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultTheme);

  useEffect(() => {
    dispatch(authThunks.initializeApp());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeAppProvider themeMode={themeMode}>
      <ErrorSnackbar />
      <CssBaseline />
      <Header themeMode={themeMode} setThemeMode={setThemeMode} />
      <Container fixed>
        <Outlet />
      </Container>
    </ThemeAppProvider>
  );
}

export default App;
