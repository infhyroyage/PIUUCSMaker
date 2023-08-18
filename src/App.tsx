import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import SystemErrorSnackbar from "./components/SystemErrorSnackbar";
import UserErrorSnackbar from "./components/UserErrorSnackbar";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useRecoilState, useRecoilValue } from "recoil";
import WorkSpace from "./components/WorkSpace";
import { topBarTitleState, zoomIdxState } from "./service/atoms";
import MenuIcon from "@mui/icons-material/Menu";
import MenuDrawer from "./components/MenuDrawer";
import { ZOOM_VALUES } from "./service/zoom";
import NewFileDialog from "./components/NewFileDialog";
import { MUI_DEFAULT_Z_INDEX } from "./service/mui";

function App() {
  const [isOpenedDrawer, setIsOpenedDrawer] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const topBarTitle = useRecoilValue<string>(topBarTitleState);
  const [zoomIdx, setZoomIdx] = useRecoilState<number>(zoomIdxState);

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
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" flexGrow={1} ml={4}>
            {topBarTitle}
          </Typography>
          <FormControl size="small" sx={{ marginRight: 4 }}>
            <Select
              value={`${zoomIdx}`}
              onChange={(event: SelectChangeEvent) =>
                setZoomIdx(Number(event.target.value))
              }
            >
              {ZOOM_VALUES.map((zoomValue: number, idx: number) => (
                <MenuItem
                  key={idx}
                  value={`${idx}`}
                >{`${zoomValue}x`}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex" }}>
        <MenuDrawer isOpenedDrawer={isOpenedDrawer} />
        <WorkSpace />
      </Box>
      <NewFileDialog />
      <UserErrorSnackbar />
      <SystemErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
