import { useEffect, useMemo } from "react";
import ReactGA from "react-ga4";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import UserErrorSnackbar from "./components/snackbar/UserErrorSnackbar";
import WorkSpace from "./components/workspace/WorkSpace";
import MenuDrawer from "./components/menu/MenuDrawer";
import NewUCSDialog from "./components/dialog/NewUCSDialog";
import { MUI_DEFAULT_Z_INDEX } from "./services/styles";
import MenuBar from "./components/menu/MenuBar";
import { useRecoilState, useRecoilValue } from "recoil";
import { isDarkModeState, ucsNameState } from "./services/atoms";
import SuccessSnackbar from "./components/snackbar/SuccessSnackbar";
import EditBlockDialog from "./components/dialog/EditBlockDialog";
import AdjustBlockDialog from "./components/dialog/AdjustBlockDialog";
import ReadyUCS from "./components/workspace/ReadyUCS";
import { AggregateDialog } from "./components/dialog/AggregateDialog";

function App() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);
  const ucsName = useRecoilValue<string | null>(ucsNameState);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
        // Uniformly increase default z-index scales in MUI by 1000 times
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

  // Activate Google Analytics only in production mode
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      ReactGA.initialize("G-XLZYQZ4979");
    }
  }, []);

  useEffect(
    () =>
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches),
    [setIsDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MenuBar />
      <MenuDrawer />
      {ucsName === null ? <ReadyUCS /> : <WorkSpace />}
      <AggregateDialog />
      <AdjustBlockDialog />
      <EditBlockDialog />
      <NewUCSDialog />
      <SuccessSnackbar />
      <UserErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
