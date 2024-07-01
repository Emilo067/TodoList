import React, { useEffect, useState } from "react";
import "app/App.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import { MenuButton } from "common/components/MenuButton/MenuButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Switch from "@mui/material/Switch";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "app/store";
import { CircularProgress, LinearProgress } from "@mui/material";
import { RequestStatusType } from "app/app.reducer";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { Outlet } from "react-router-dom";
import { authThunks } from "features/auth/model/auth.reducer";
import { selectIsInitialized, selectStatus } from "app/app.selectors";
import { TaskType } from "features/TodolistList/api/taskApi.types";

export type TasksStateType = {
  [key: string]: TaskType[];
};

type ThemeMode = "dark" | "light";

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const LOCAL_STORAGE_THEME_KEY = "theme";
  const defaultTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as ThemeMode;
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultTheme);

  const isInitialized = useSelector<AppRootStateType, boolean>(selectIsInitialized);
  const status = useSelector<AppRootStateType, RequestStatusType>(selectStatus);
  const dispatch = useDispatch();

  const theme = createTheme({
    palette: {
      mode: themeMode === "light" ? "light" : "dark",
      primary: {
        main: "#087EA4",
      },
    },
  });

  useEffect(() => {
    dispatch(authThunks.initializeApp());
  }, [dispatch]);

  const changeModeHandler = () => {
    const newTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(newTheme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
  };

  const logoutHandler = () => {
    dispatch(authThunks.logout());
  };

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <ErrorSnackbar />
      <CssBaseline />
      <AppBar position="static" sx={{ mb: "30px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            <MenuButton>Login</MenuButton>
            <MenuButton onClick={logoutHandler}>Logout</MenuButton>
            <MenuButton>Faq</MenuButton>
            <Switch color={"default"} onChange={changeModeHandler} />
          </div>
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
