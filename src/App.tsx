import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  CssBaseline,
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

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const topBarTitle = useRecoilValue<string>(topBarTitleState);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
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
      <AppBar position="sticky" sx={{ height: "64px" }}>
        <Toolbar sx={{ height: "100%" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
      <WorkSpace />
      <UserErrorSnackbar />
      <SystemErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
