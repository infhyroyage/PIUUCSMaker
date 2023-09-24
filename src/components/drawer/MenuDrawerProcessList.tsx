import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { isOpenedMenuDrawerState, isPlayingState } from "../service/atoms";
import { useRecoilValue } from "recoil";
import {
  generateListItemButtonStyle,
  generateListItemIconStyle,
} from "../service/styles";

function MenuDrawerProcessList() {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={isPlaying}
          onClick={() => alert("TODO")}
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
            <UndoIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary="Undo" sx={{ opacity: 1 }} />
          )}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={isPlaying}
          onClick={() => alert("TODO")}
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
            <RedoIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary="Redo" sx={{ opacity: 1 }} />
          )}
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default MenuDrawerProcessList;
