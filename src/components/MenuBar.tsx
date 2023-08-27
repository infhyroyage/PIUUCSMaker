import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import { ZOOM_VALUES } from "../service/zoom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isDarkModeState,
  isOpenedMenuDrawerState,
  topBarTitleState,
  zoomIdxState,
} from "../service/atoms";
import {
  AppBar,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";

export const MENU_BAR_HEIGHT: number = 64;

function MenuBar() {
  const [isOpenedMenuDrawer, setIsOpenedMenuDrawer] = useRecoilState<boolean>(
    isOpenedMenuDrawerState
  );
  const [zoomIdx, setZoomIdx] = useRecoilState<number>(zoomIdxState);
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);
  const topBarTitle = useRecoilValue<string>(topBarTitleState);

  return (
    <AppBar
      position="sticky"
      sx={{
        height: `${MENU_BAR_HEIGHT}px`,
        zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ height: "100%" }}>
        <IconButton
          color="inherit"
          onClick={() => setIsOpenedMenuDrawer(!isOpenedMenuDrawer)}
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
              <MenuItem key={idx} value={`${idx}`}>{`${zoomValue}x`}</MenuItem>
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
  );
}

export default MenuBar;
