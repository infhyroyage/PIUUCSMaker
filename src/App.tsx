import { useCallback, useEffect, useMemo } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import UserErrorSnackbar from "./components/snackbar/UserErrorSnackbar";
import WorkSpace from "./components/WorkSpace";
import MenuDrawer from "./components/drawer/MenuDrawer";
import NewUCSDialog from "./components/dialog/NewUCSDialog";
import { MUI_DEFAULT_Z_INDEX } from "./service/styles";
import MenuBar from "./components/MenuBar";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isDarkModeState,
  mouseDownState,
  selectorState,
} from "./service/atoms";
import { MouseDown, Selector } from "./types/chart";
import SuccessSnackbar from "./components/snackbar/SuccessSnackbar";
import EditBlockDialog from "./components/dialog/EditBlockDialog";

function App() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);
  const setMouseDown = useSetRecoilState<MouseDown>(mouseDownState);
  const setSelector = useSetRecoilState<Selector>(selectorState);

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

  const onMouseUp = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // 左クリック時のみ、選択領域・マウス押下時のパラメーターを初期化
      if (event.button === 0) {
        setMouseDown(null);
        setSelector({ changingCords: null, completedCords: null });
      }
    },
    [setMouseDown]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div onMouseUp={onMouseUp}>
        <MenuBar />
        <div style={{ display: "flex" }}>
          <MenuDrawer />
          <WorkSpace />
        </div>
        <NewUCSDialog />
        <EditBlockDialog />
        <SuccessSnackbar />
        <UserErrorSnackbar />
      </div>
    </ThemeProvider>
  );
}

export default App;
