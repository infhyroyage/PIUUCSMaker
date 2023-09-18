import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { useRecoilValue } from "recoil";
import {
  chartState,
  isOpenedMenuDrawerState,
  isPlayingState,
} from "../service/atoms";
import usePlayingMusic from "../hooks/usePlayingMusic";
import { Chart } from "../types/ucs";
import {
  generateListItemButtonStyle,
  generateListItemIconStyle,
} from "../service/styles";

function MenuDrawerPlayingList() {
  const chart: Chart = useRecoilValue<Chart>(chartState);
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);

  const { isUploadingMP3, start, stop, uploadMP3 } = usePlayingMusic();

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          component="label"
          disabled={isPlaying || isUploadingMP3}
          htmlFor="upload-mp3"
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <input
            id="upload-mp3"
            type="file"
            accept=".mp3"
            style={{ display: "none" }}
            onChange={uploadMP3}
          />
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
            <AudioFileIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText
              primary={isUploadingMP3 ? "Ready..." : "Upload MP3"}
              sx={{ opacity: 1 }}
            />
          )}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={chart.blocks.length === 0 || isUploadingMP3}
          onClick={() => (isPlaying ? stop() : start())}
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
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
    </List>
  );
}

export default MenuDrawerPlayingList;
