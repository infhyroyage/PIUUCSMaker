import { ZOOM_VALUES } from "../../services/assets";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  volumeValueState,
  zoomState,
  isPlayingState,
  isProtectedState,
} from "../../services/atoms";
import {
  AppBar,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Toolbar,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import { Zoom } from "../../types/menu";
import { MENU_BAR_HEIGHT } from "../../services/styles";
import MenuBarTitle from "./MenuBarTitle";

function MenuBar() {
  const [muteVolBuf, setMuteVolBuf] = useState<number | null>(null);
  const [volumeValue, setVolumeValue] =
    useRecoilState<number>(volumeValueState);
  const [zoom, setZoom] = useRecoilState<Zoom>(zoomState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const isProtected = useRecoilValue<boolean>(isProtectedState);

  const onClickVolumeButton = useCallback(() => {
    if (muteVolBuf === null) {
      setMuteVolBuf(volumeValue);
      setVolumeValue(0);
    } else {
      setVolumeValue(muteVolBuf);
      setMuteVolBuf(null);
    }
  }, [muteVolBuf, setMuteVolBuf, setVolumeValue, volumeValue]);

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
        <div style={{ width: `${MENU_BAR_HEIGHT}px` }} />
        <MenuBarTitle />
        <Stack alignItems="center" direction="row" spacing={{ xs: 0, sm: 1 }}>
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
            spacing={{ xs: 0, sm: 0.5 }}
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
