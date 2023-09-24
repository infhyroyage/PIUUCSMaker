import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isMuteBeatsState,
  isOpenedMenuDrawerState,
  isPlayingState,
  ucsNameState,
} from "../service/atoms";
import usePlayingMusic from "../hooks/usePlayingMusic";
import {
  generateListItemButtonStyle,
  generateListItemIconStyle,
} from "../service/styles";

function MenuDrawerPlayingList() {
  const [isMuteBeats, setIsMuteBeats] =
    useRecoilState<boolean>(isMuteBeatsState);
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const ucsName = useRecoilValue<string | null>(ucsNameState);

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
          onClick={() => setIsMuteBeats(!isMuteBeats)}
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
            {isMuteBeats ? <MusicOffIcon /> : <MusicNoteIcon />}
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText
              primary={isMuteBeats ? "Mute Beats" : "Unmute Beats"}
              sx={{ opacity: 1 }}
            />
          )}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={ucsName === null || isUploadingMP3}
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
