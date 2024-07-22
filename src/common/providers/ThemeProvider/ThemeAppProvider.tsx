import React, { FC, ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export type ThemeMode = "dark" | "light";

type Props = {
  themeMode: ThemeMode;
  children: ReactNode;
};

export const ThemeAppProvider: FC<Props> = ({ themeMode, children }) => {
  const theme = createTheme({
    palette: {
      mode: themeMode === "dark" ? "dark" : "light",
      primary: {
        main: "#087EA4",
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
