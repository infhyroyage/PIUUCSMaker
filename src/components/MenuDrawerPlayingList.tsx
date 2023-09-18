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
import useMenuDrawerStyles from "../hooks/useMenuDrawerStyles";
import usePlayingMusic from "../hooks/usePlayingMusic";
import { Chart } from "../types/ucs";

function MenuDrawerPlayingList() {
  const chart: Chart = useRecoilValue<Chart>(chartState);
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);

  const { isUploadingMP3, start, stop, uploadMP3 } = usePlayingMusic();
  const { listItemButtonStyle, listItemIconStyle } = useMenuDrawerStyles();

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          component="label"
          disabled={isPlaying || isUploadingMP3}
          htmlFor="upload-mp3"
          sx={listItemButtonStyle}
        >
          <input
            id="upload-mp3"
            type="file"
            accept=".mp3"
            style={{ display: "none" }}
            onChange={uploadMP3}
          />
          <ListItemIcon sx={listItemIconStyle}>
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
    </List>
  );
}

export default MenuDrawerPlayingList;
