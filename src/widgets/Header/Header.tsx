import React, { FC, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import LogoApp from "common/assets/icons/svg/logoApp.svg";
import { MenuButton } from "common/components/MenuButton/MenuButton";
import { MaterialUISwitch } from "common/components/Switch/Switch";
import { LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store/store";
import { selectIsLoggedIn } from "features/auth/model/auth.selectors";
import { RequestStatusType } from "app/model/app.reducer";
import { selectStatus } from "app/model/app.selectors";
import { LOCAL_STORAGE_SWITCH_KEY, LOCAL_STORAGE_THEME_KEY } from "shared/const/common";
import { authThunks } from "features/auth/model/auth.reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { ThemeMode } from "common/providers/ThemeProvider/ThemeAppProvider";

type Props = {
  themeMode: ThemeMode;
  setThemeMode: (themeMode: ThemeMode) => void;
};

export const Header: FC<Props> = ({ themeMode, setThemeMode }) => {
  const isLoggedIn = useSelector<AppRootStateType, boolean>(selectIsLoggedIn);
  const status = useSelector<AppRootStateType, RequestStatusType>(selectStatus);
  const defaultSwitchState = localStorage.getItem(LOCAL_STORAGE_SWITCH_KEY) === "true";
  const [switchState, setSwitchState] = useState<boolean>(defaultSwitchState);
  const dispatch = useAppDispatch();

  const changeModeHandler = () => {
    const newTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(newTheme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
  };

  const changeSwitchStateHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSwitchState = event.target.checked;
    setSwitchState(newSwitchState);
    localStorage.setItem(LOCAL_STORAGE_SWITCH_KEY, newSwitchState.toString());
    changeModeHandler();
  };

  const logoutHandler = () => {
    dispatch(authThunks.logout());
  };

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <img src={LogoApp as any} alt={"logo"} />
        <div>
          <MenuButton disabled={!isLoggedIn} onClick={logoutHandler}>
            Logout
          </MenuButton>
          <MaterialUISwitch color={"default"} checked={switchState} onChange={changeSwitchStateHandler} />
        </div>
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  );
};
