import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import useMenuDrawerStyles from "../hooks/useMenuDrawerStyles";
import { isOpenedMenuDrawerState } from "../service/atoms";
import { useRecoilValue } from "recoil";

function MenuDrawerProcessList() {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  const { listItemButtonStyle, listItemIconStyle } = useMenuDrawerStyles();

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton onClick={() => alert("TODO")} sx={listItemButtonStyle}>
          <ListItemIcon sx={listItemIconStyle}>
            <UndoIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary="Undo" sx={{ opacity: 1 }} />
          )}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton onClick={() => alert("TODO")} sx={listItemButtonStyle}>
          <ListItemIcon sx={listItemIconStyle}>
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
