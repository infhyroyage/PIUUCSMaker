import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import useMenuDrawerStyles from "../hooks/useMenuDrawerStyles";
import { isOpenedMenuDrawerState, zoomState } from "../service/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { ZOOM_VALUES } from "../service/zoom";
import { Zoom } from "../types/atoms";
import { useEffect } from "react";
import usePlayingMusic from "../hooks/usePlayingMusic";

function MenuDrawerZoomList() {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const [zoom, setZoom] = useRecoilState<Zoom>(zoomState);

  const { listItemButtonStyle, listItemIconStyle } = useMenuDrawerStyles();
  const { isPlaying } = usePlayingMusic();

  useEffect(() => {
    if (zoom.top !== null) scrollTo({ top: zoom.top });
  }, [zoom]);

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={zoom.idx === ZOOM_VALUES.length - 1 || isPlaying}
          onClick={() =>
            setZoom({
              idx: zoom.idx + 1,
              top:
                (document.documentElement.scrollTop *
                  ZOOM_VALUES[zoom.idx + 1]) /
                ZOOM_VALUES[zoom.idx],
            })
          }
          sx={listItemButtonStyle}
        >
          <ListItemIcon sx={listItemIconStyle}>
            <ZoomInIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary="Zoom In" sx={{ opacity: 1 }} />
          )}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={zoom.idx === 0 || isPlaying}
          onClick={() =>
            setZoom({
              idx: zoom.idx - 1,
              top:
                (document.documentElement.scrollTop *
                  ZOOM_VALUES[zoom.idx - 1]) /
                ZOOM_VALUES[zoom.idx],
            })
          }
          sx={listItemButtonStyle}
        >
          <ListItemIcon sx={listItemIconStyle}>
            <ZoomOutIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary="Zoom Out" sx={{ opacity: 1 }} />
          )}
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default MenuDrawerZoomList;
