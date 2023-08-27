import { useEffect, useMemo } from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import SystemErrorSnackbar from "./components/SystemErrorSnackbar";
import UserErrorSnackbar from "./components/UserErrorSnackbar";
import WorkSpace from "./components/WorkSpace";
import MenuDrawer from "./components/MenuDrawer";
import NewFileDialog from "./components/NewFileDialog";
import { MUI_DEFAULT_Z_INDEX } from "./service/mui";
import MenuBar from "./components/MenuBar";
import { useRecoilState, useSetRecoilState } from "recoil";
import { MouseDownInfo } from "./types/atoms";
import { isDarkModeState, mouseDownInfoState } from "./service/atoms";

function App() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);
  const setMouseDownInfo = useSetRecoilState<MouseDownInfo | null>(
    mouseDownInfoState
  );

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
      <div onMouseUp={() => setMouseDownInfo(null)}>
        <MenuBar />
        <Box sx={{ display: "flex" }}>
          <MenuDrawer />
          <WorkSpace />
        </Box>
      </div>
      <NewFileDialog />
      <UserErrorSnackbar />
      <SystemErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
