import { ZOOM_VALUES } from "../../service/zoom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  volumeValueState,
  zoomState,
  isPlayingState,
  mp3NameState,
  ucsNameState,
  columnsState,
  isPerformanceState,
  isProtectedState,
  isOpenedMenuDrawerState,
} from "../../service/atoms";
import {
  AppBar,
  Box,
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
import { useEffect, useState } from "react";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import { Zoom } from "../../types/ui";
import {
  MENU_BAR_HEIGHT,
  MENU_DRAWER_OPENED_WIDTH,
} from "../../service/styles";

function MenuBar() {
  const [muteVolBuf, setMuteVolBuf] = useState<number | null>(null);
  const [volumeValue, setVolumeValue] =
    useRecoilState<number>(volumeValueState);
  const [zoom, setZoom] = useRecoilState<Zoom>(zoomState);
  const columns = useRecoilValue<5 | 10>(columnsState);
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const isPerformance = useRecoilValue<boolean>(isPerformanceState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const isProtected = useRecoilValue<boolean>(isProtectedState);
  const mp3Name = useRecoilValue<string | null>(mp3NameState);
  const ucsName = useRecoilValue<string | null>(ucsNameState);

  const onClickVolumeButton = () => {
    if (muteVolBuf === null) {
      setMuteVolBuf(volumeValue);
      setVolumeValue(0);
    } else {
      setVolumeValue(muteVolBuf);
      setMuteVolBuf(null);
    }
  };

  // 編集中に離脱した場合、その離脱を抑止する組込みダイアログを表示
  useEffect(() => {
    const handleBeforeunload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    if (isProtected) {
      window.addEventListener("beforeunload", handleBeforeunload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeunload);
      };
    } else {
      window.removeEventListener("beforeunload", handleBeforeunload);
    }
  }, [isProtected]);

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ height: `${MENU_BAR_HEIGHT}px` }} variant="dense">
        <Box
          sx={(theme: Theme) => ({
            width: `${
              isOpenedMenuDrawer ? MENU_DRAWER_OPENED_WIDTH : MENU_BAR_HEIGHT
            }px`,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: isOpenedMenuDrawer
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          })}
        />
        <Box flexGrow={1}>
          <Typography variant="subtitle1" noWrap component="div">
            {`${isProtected ? "*" : ""}${ucsName || "PIU UCS Maker"}`}
          </Typography>
          {ucsName !== null && (
            <Typography variant="caption" noWrap component="div">
              {`${columns === 5 ? "Single" : "Double"} ${
                isPerformance ? "Performance" : ""
              }${mp3Name ? ` (${mp3Name})` : ""}`}
            </Typography>
          )}
        </Box>
        <Stack alignItems="center" direction="row" spacing={{ xs: 1, sm: 1.5 }}>
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
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
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
          <Stack
            alignItems="center"
            direction="row"
            spacing={{ xs: 0.5, sm: 0.75 }}
          >
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
              size="small"
              step={0.01}
              sx={{ width: `${MENU_BAR_HEIGHT}px`, color: "white" }}
              value={muteVolBuf || volumeValue}
            />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default MenuBar;
