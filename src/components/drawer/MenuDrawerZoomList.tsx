import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import {
  isOpenedMenuDrawerState,
  isPlayingState,
  zoomState,
} from "../../service/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { ZOOM_VALUES } from "../../service/zoom";
import { Zoom } from "../../types/chart";
import { useEffect } from "react";
import {
  generateListItemButtonStyle,
  generateListItemIconStyle,
} from "../../service/styles";

function MenuDrawerZoomList() {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const [zoom, setZoom] = useRecoilState<Zoom>(zoomState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);

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
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
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
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
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
