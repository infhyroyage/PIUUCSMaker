import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  CssBaseline,
  IconButton,
  Switch,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import SystemErrorSnackbar from "./components/SystemErrorSnackbar";
import UserErrorSnackbar from "./components/UserErrorSnackbar";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useRecoilValue } from "recoil";
import WorkSpace from "./components/WorkSpace";
import { topBarTitleState } from "./service/atoms";
import MenuIcon from "@mui/icons-material/Menu";
import MenuDrawer from "./components/MenuDrawer";

// MUIコンポーネントのz-indexのデフォルト値
// https://mui.com/material-ui/customization/z-index
const MUI_DEFAULT_Z_INDEX: Record<string, number> = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

function App() {
  const [isOpenedDrawer, setIsOpenedDrawer] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const topBarTitle = useRecoilValue<string>(topBarTitleState);

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
      <AppBar
        position="sticky"
        sx={{ height: "64px", zIndex: theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ height: "100%" }}>
          <IconButton
            color="inherit"
            onClick={() => setIsOpenedDrawer(!isOpenedDrawer)}
            edge="start"
            sx={{ marginRight: 4 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" flexGrow={1}>
            {topBarTitle}
          </Typography>
          <Tooltip title={isDarkMode ? "ダーク" : "ライト"}>
            <Switch
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              icon={<LightModeIcon sx={{ color: "white" }} />}
              checkedIcon={<DarkModeIcon sx={{ color: "white" }} />}
              sx={{
                width: 58,
                height: 38,
                padding: 0,
                "& .MuiSwitch-switchBase": {
                  padding: 0,
                  margin: "7px",
                },
                "& .MuiSwitch-track": {
                  borderRadius: 38 / 2,
                },
              }}
            />
          </Tooltip>
        </Toolbar>
      </AppBar>
      <MenuDrawer isOpenedDrawer={isOpenedDrawer} />
      <WorkSpace />
      <UserErrorSnackbar />
      <SystemErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
