import { useEffect, useMemo } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import SystemErrorSnackbar from "./components/SystemErrorSnackbar";
import UserErrorSnackbar from "./components/UserErrorSnackbar";
import WorkSpace from "./components/WorkSpace";
import MenuDrawer from "./components/MenuDrawer";
import NewUCSDialog from "./components/NewUCSDialog";
import { MUI_DEFAULT_Z_INDEX } from "./service/styles";
import MenuBar from "./components/MenuBar";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isDarkModeState, mouseDownsState } from "./service/atoms";
import { MouseDown } from "./types/atoms";

function App() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);
  const setMouseDowns = useSetRecoilState<MouseDown[]>(mouseDownsState);

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
      <div onMouseUp={() => setMouseDowns(new Array<MouseDown>(10).fill(null))}>
        <MenuBar />
        <div style={{ display: "flex" }}>
          <MenuDrawer />
          <WorkSpace />
        </div>
        <NewUCSDialog />
        <UserErrorSnackbar />
        <SystemErrorSnackbar />
      </div>
    </ThemeProvider>
  );
}

export default App;
