import MenuIcon from "@mui/icons-material/Menu";
import { ZOOM_VALUES } from "../service/zoom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isOpenedMenuDrawerState,
  menuBarHeightState,
  menuBarTitleState,
  zoomIdxState,
} from "../service/atoms";
import {
  AppBar,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

function MenuBar() {
  const [windowInnerWidth, setWindowInnerWidth] = useState<number>(
    window.innerWidth
  );
  const [isOpenedMenuDrawer, setIsOpenedMenuDrawer] = useRecoilState<boolean>(
    isOpenedMenuDrawerState
  );
  const [zoomIdx, setZoomIdx] = useRecoilState<number>(zoomIdxState);
  const menuBarTitle = useRecoilValue<string>(menuBarTitleState);
  const setMenuBarHeight = useSetRecoilState<number>(menuBarHeightState);

  const updateSize = () => {
    setWindowInnerWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const toolBarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (toolBarRef.current) {
      setMenuBarHeight(toolBarRef.current.getBoundingClientRect().height);
    }
  }, [setMenuBarHeight, windowInnerWidth]);

  return (
    <AppBar
      position="sticky"
      sx={{ zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar ref={toolBarRef}>
        <IconButton
          color="inherit"
          onClick={() => setIsOpenedMenuDrawer(!isOpenedMenuDrawer)}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" flexGrow={1} ml={4}>
          {menuBarTitle}
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
      </Toolbar>
    </AppBar>
  );
}

export default MenuBar;
