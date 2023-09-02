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
// import PauseIcon from '@mui/icons-material/Pause';
import { useRecoilState, useRecoilValue } from "recoil";
import { isOpenedMenuDrawerState, isVolumeOnState } from "../service/atoms";
import useMenuDrawerStyles from "../hooks/useMenuDrawerStyles";

function MenuDrawerPlayingList() {
  const [isVolumeOn, setIsVolumeOn] = useRecoilState<boolean>(isVolumeOnState);
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  const { listItemButtonStyle, listItemIconStyle } = useMenuDrawerStyles();

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton onClick={() => alert("TODO")} sx={listItemButtonStyle}>
          <ListItemIcon sx={listItemIconStyle}>
            <PlayArrowIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary="Play" sx={{ opacity: 1 }} />
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
