import { memo, useMemo } from "react";
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
import { isOpenedNewFileDialogState, zoomIdxState } from "../service/atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ZOOM_VALUES } from "../service/zoom";
import useOpenFile from "../hooks/useOpenFile";
// import PauseIcon from '@mui/icons-material/Pause';

const OPENED_DRAWER_WIDTH = 200;

function MenuDrawer({ isOpenedDrawer }: MenuDrawerProps) {
  const [zoomIdx, setZoomIdx] = useRecoilState<number>(zoomIdxState);
  const setIsOpenedNewChartDialog = useSetRecoilState<boolean>(
    isOpenedNewFileDialogState
  );

  const { isOpeningFile, handleOpenFile } = useOpenFile();

  const listItemButtonSX = useMemo(() => {
    return {
      justifyContent: isOpenedDrawer ? "initial" : "center",
      minHeight: 48,
      px: 2.5,
    };
  }, [isOpenedDrawer]);

  const listItemIconSX = useMemo(() => {
    return {
      justifyContent: "center",
      minWidth: 0,
      mr: isOpenedDrawer ? 3 : "auto",
    };
  }, [isOpenedDrawer]);

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
      <List>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => setIsOpenedNewChartDialog(true)}
            sx={listItemButtonSX}
          >
            <ListItemIcon sx={listItemIconSX}>
              <AddIcon />
            </ListItemIcon>
            {isOpenedDrawer && (
              <ListItemText primary="New UCS File" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            component="label"
            htmlFor="upload"
            disabled={isOpeningFile}
            sx={listItemButtonSX}
          >
            <input
              id="upload"
              type="file"
              accept=".ucs"
              style={{ display: "none" }}
              onChange={handleOpenFile}
            />
            <ListItemIcon sx={listItemIconSX}>
              <FileOpenIcon />
            </ListItemIcon>
            {isOpenedDrawer && (
              <ListItemText primary="Open UCS File" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton onClick={() => alert("TODO")} sx={listItemButtonSX}>
            <ListItemIcon sx={listItemIconSX}>
              <SaveAsIcon />
            </ListItemIcon>
            {isOpenedDrawer && (
              <ListItemText primary="Save As" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton onClick={() => alert("TODO")} sx={listItemButtonSX}>
            <ListItemIcon sx={listItemIconSX}>
              <UndoIcon />
            </ListItemIcon>
            {isOpenedDrawer && (
              <ListItemText primary="Undo" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton onClick={() => alert("TODO")} sx={listItemButtonSX}>
            <ListItemIcon sx={listItemIconSX}>
              <RedoIcon />
            </ListItemIcon>
            {isOpenedDrawer && (
              <ListItemText primary="Redo" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => setZoomIdx(zoomIdx + 1)}
            disabled={zoomIdx === ZOOM_VALUES.length - 1}
            sx={listItemButtonSX}
          >
            <ListItemIcon sx={listItemIconSX}>
              <ZoomInIcon />
            </ListItemIcon>
            {isOpenedDrawer && (
              <ListItemText primary="Zoom In" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => setZoomIdx(zoomIdx - 1)}
            disabled={zoomIdx === 0}
            sx={listItemButtonSX}
          >
            <ListItemIcon sx={listItemIconSX}>
              <ZoomOutIcon />
            </ListItemIcon>
            {isOpenedDrawer && (
              <ListItemText primary="Zoom Out" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton onClick={() => alert("TODO")} sx={listItemButtonSX}>
            <ListItemIcon sx={listItemIconSX}>
              <PlayArrowIcon />
            </ListItemIcon>
            {isOpenedDrawer && (
              <ListItemText primary="Play" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default memo(MenuDrawer);
