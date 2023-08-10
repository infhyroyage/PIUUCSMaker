import React, { memo, useMemo } from "react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
} from "@mui/material";
import { MenuDrawerProps } from "../types/props";
import AddIcon from "@mui/icons-material/Add";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import PauseIcon from '@mui/icons-material/Pause';

const OPENED_DRAWER_WIDTH = 200;

type MenuListItem = {
  label: string;
  icon: React.ElementType;
  onClick: React.MouseEventHandler<HTMLDivElement>;
};
function MenuDrawer({ isOpenedDrawer }: MenuDrawerProps) {
  const menuListItems: MenuListItem[][] = useMemo(
    () => [
      [
        {
          label: "New UCS",
          icon: AddIcon,
          onClick: () => alert("TODO"),
        },
        {
          label: "Open UCS File",
          icon: FileOpenIcon,
          onClick: () => alert("TODO"),
        },
        {
          label: "Save As",
          icon: SaveAsIcon,
          onClick: () => alert("TODO"),
        },
      ],
      [
        {
          label: "Undo",
          icon: UndoIcon,
          onClick: () => alert("TODO"),
        },
        {
          label: "Redo",
          icon: RedoIcon,
          onClick: () => alert("TODO"),
        },
      ],
      [
        {
          label: "Zoom In",
          icon: ZoomInIcon,
          onClick: () => alert("TODO"),
        },
        {
          label: "Zoom Out",
          icon: ZoomOutIcon,
          onClick: () => alert("TODO"),
        },
      ],
      [
        {
          label: "Play",
          icon: PlayArrowIcon,
          onClick: () => alert("TODO"),
        },
      ],
    ],
    []
  );

  return (
    <Drawer
      variant="permanent"
      open={isOpenedDrawer}
      PaperProps={{ elevation: 3, sx: { marginTop: "64px" } }}
      sx={(theme: Theme) => ({
        width: isOpenedDrawer ? OPENED_DRAWER_WIDTH : "64px",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: isOpenedDrawer
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
        }),
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        overflowX: "hidden",
        "& .MuiDrawer-paper": {
          width: isOpenedDrawer ? OPENED_DRAWER_WIDTH : "64px",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: isOpenedDrawer
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        },
      })}
    >
      {menuListItems.map((listItems: MenuListItem[], i: number) => (
        <React.Fragment key={i}>
          <List>
            {listItems.map((item: MenuListItem, j: number) => (
              <ListItem key={j} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={item.onClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: isOpenedDrawer ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpenedDrawer ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <item.icon />
                  </ListItemIcon>
                  {isOpenedDrawer && (
                    <ListItemText primary={item.label} sx={{ opacity: 1 }} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {i !== menuListItems.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Drawer>
  );
}

export default memo(MenuDrawer);
