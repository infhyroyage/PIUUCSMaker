import MenuIcon from "@mui/icons-material/Menu";
import { ZOOM_VALUES } from "../service/zoom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isOpenedMenuDrawerState,
  menuBarHeightState,
  fileNamesState,
  volumeValueState,
  zoomState,
  isPlayingState,
} from "../service/atoms";
import {
  AppBar,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import { FileNames, Zoom } from "../types/atoms";

function MenuBar() {
  const [muteVolBuf, setMuteVolBuf] = useState<number | null>(null);
  const [windowInnerWidth, setWindowInnerWidth] = useState<number>(
    window.innerWidth
  );
  const [isOpenedMenuDrawer, setIsOpenedMenuDrawer] = useRecoilState<boolean>(
    isOpenedMenuDrawerState
  );
  const [volumeValue, setVolumeValue] =
    useRecoilState<number>(volumeValueState);
  const [zoom, setZoom] = useRecoilState<Zoom>(zoomState);
  const fileNames = useRecoilValue<FileNames>(fileNamesState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const setMenuBarHeight = useSetRecoilState<number>(menuBarHeightState);

  const onClickVolumeButton = () => {
    if (muteVolBuf === null) {
      setMuteVolBuf(volumeValue);
      setVolumeValue(0);
    } else {
      setVolumeValue(muteVolBuf);
      setMuteVolBuf(null);
    }
  };

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
          {`${fileNames.ucs || "PIU UCS Maker"}${
            fileNames.mp3 ? ` (${fileNames.mp3})` : ""
          }`}
        </Typography>
        <Stack alignItems="center" direction="row" spacing={4}>
          <FormControl size="small">
            <Select
              disabled={isPlaying}
              onChange={(event: SelectChangeEvent) =>
                setZoom({
                  idx: Number(event.target.value),
                  top:
                    (document.documentElement.scrollTop *
                      ZOOM_VALUES[Number(event.target.value)]) /
                    ZOOM_VALUES[zoom.idx],
                })
              }
              value={`${zoom.idx}`}
            >
              {ZOOM_VALUES.map((zoomValue: number, idx: number) => (
                <MenuItem
                  key={idx}
                  value={`${idx}`}
                >{`${zoomValue}x`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack alignItems="center" direction="row" spacing={2}>
            <IconButton color="inherit" onClick={onClickVolumeButton}>
              {muteVolBuf !== null ? (
                <VolumeOffIcon />
              ) : volumeValue === 0 ? (
                <VolumeMuteIcon />
              ) : volumeValue <= 0.5 ? (
                <VolumeDownIcon />
              ) : (
                <VolumeUpIcon />
              )}
            </IconButton>
            <Slider
              disabled={muteVolBuf !== null}
              max={1}
              min={0}
              onChange={(_, value: number | number[]) => {
                setVolumeValue(value as number);
              }}
              step={0.01}
              sx={{ width: 100 }}
              value={muteVolBuf || volumeValue}
            />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default MenuBar;
