import { useMemo } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  isOpenedMenuDrawerState,
  isOpenedNewFileDialogState,
  zoomIdxState,
} from "../service/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ZOOM_VALUES } from "../service/zoom";
import useOpenFile from "../hooks/useOpenFile";
// import PauseIcon from '@mui/icons-material/Pause';

const OPENED_DRAWER_WIDTH = 200;

function MenuDrawer() {
  const [zoomIdx, setZoomIdx] = useRecoilState<number>(zoomIdxState);
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const setIsOpenedNewChartDialog = useSetRecoilState<boolean>(
    isOpenedNewFileDialogState
  );

  const { isOpeningFile, handleOpenFile } = useOpenFile();

  const listItemButtonSX = useMemo(() => {
    return {
      justifyContent: isOpenedMenuDrawer ? "initial" : "center",
      minHeight: 48,
      px: 2.5,
    };
  }, [isOpenedMenuDrawer]);

  const listItemIconSX = useMemo(() => {
    return {
      justifyContent: "center",
      minWidth: 0,
      mr: isOpenedMenuDrawer ? 3 : "auto",
    };
  }, [isOpenedMenuDrawer]);

  return (
    <Drawer
      variant="permanent"
      open={isOpenedMenuDrawer}
      PaperProps={{ elevation: 3, sx: { marginTop: "64px" } }}
      sx={(theme: Theme) => ({
        width: isOpenedMenuDrawer ? OPENED_DRAWER_WIDTH : "64px",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: isOpenedMenuDrawer
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
        }),
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        overflowX: "hidden",
        "& .MuiDrawer-paper": {
          width: isOpenedMenuDrawer ? OPENED_DRAWER_WIDTH : "64px",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: isOpenedMenuDrawer
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
            {isOpenedMenuDrawer && (
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
            {isOpenedMenuDrawer && (
              <ListItemText primary="Open UCS File" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton onClick={() => alert("TODO")} sx={listItemButtonSX}>
            <ListItemIcon sx={listItemIconSX}>
              <SaveAsIcon />
            </ListItemIcon>
            {isOpenedMenuDrawer && (
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
            {isOpenedMenuDrawer && (
              <ListItemText primary="Undo" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton onClick={() => alert("TODO")} sx={listItemButtonSX}>
            <ListItemIcon sx={listItemIconSX}>
              <RedoIcon />
            </ListItemIcon>
            {isOpenedMenuDrawer && (
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
            {isOpenedMenuDrawer && (
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
            {isOpenedMenuDrawer && (
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
            {isOpenedMenuDrawer && (
              <ListItemText primary="Play" sx={{ opacity: 1 }} />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default MenuDrawer;
