import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chartState,
  isOpenedMenuDrawerState,
  isVolumeOnState,
} from "../service/atoms";
import useMenuDrawerStyles from "../hooks/useMenuDrawerStyles";
import usePlayingMusic from "../hooks/usePlayingMusic";
import { Chart } from "../types/ucs";

function MenuDrawerPlayingList() {
  const [isVolumeOn, setIsVolumeOn] = useRecoilState<boolean>(isVolumeOnState);
  const chart: Chart = useRecoilValue<Chart>(chartState);
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  const { isPlaying, start, stop } = usePlayingMusic();
  const { listItemButtonStyle, listItemIconStyle } = useMenuDrawerStyles();

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          onClick={() => (isPlaying ? stop() : start())}
          disabled={chart.blocks.length === 0}
          sx={listItemButtonStyle}
        >
          <ListItemIcon sx={listItemIconStyle}>
            {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText
              primary={isPlaying ? "Stop" : "Play"}
              sx={{ opacity: 1 }}
            />
          )}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          onClick={() => setIsVolumeOn(!isVolumeOn)}
          sx={listItemButtonStyle}
        >
          <ListItemIcon sx={listItemIconStyle}>
            {isVolumeOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText
              primary={`Sound ${isVolumeOn ? "ON" : "OFF"}`}
              sx={{ opacity: 1 }}
            />
          )}
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default MenuDrawerPlayingList;
