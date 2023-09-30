import { useEffect, useMemo } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import UserErrorSnackbar from "./components/snackbar/UserErrorSnackbar";
import WorkSpace from "./components/WorkSpace";
import MenuDrawer from "./components/drawer/MenuDrawer";
import NewUCSDialog from "./components/dialog/NewUCSDialog";
import { MUI_DEFAULT_Z_INDEX } from "./service/styles";
import MenuBar from "./components/MenuBar";
import { useRecoilState } from "recoil";
import { isDarkModeState } from "./service/atoms";
import SuccessSnackbar from "./components/snackbar/SuccessSnackbar";
import EditBlockDialog from "./components/dialog/EditBlockDialog";

function App() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
        // MUIコンポーネントのz-indexのデフォルト値を一律で1000倍にする
        zIndex: Object.keys(MUI_DEFAULT_Z_INDEX).reduce(
          (accumulator: Record<string, number>, key: string) => {
            accumulator[key] = MUI_DEFAULT_Z_INDEX[key] * 1000;
            return accumulator;
          },
          {}
        ),
      }),
    [isDarkMode]
  );

  useEffect(
    () =>
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches),
    [setIsDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MenuBar />
      <div style={{ display: "flex" }}>
        <MenuDrawer />
        <WorkSpace />
      </div>
      <NewUCSDialog />
      <EditBlockDialog />
      <SuccessSnackbar />
      <UserErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
