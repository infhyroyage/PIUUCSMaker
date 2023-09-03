import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { useRecoilValue } from "recoil";
import { chartState, isOpenedMenuDrawerState } from "../service/atoms";
import useMenuDrawerStyles from "../hooks/useMenuDrawerStyles";
import usePlayingMusic from "../hooks/usePlayingMusic";
import { Chart } from "../types/ucs";

function MenuDrawerPlayingList() {
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
    </List>
  );
}

export default MenuDrawerPlayingList;
