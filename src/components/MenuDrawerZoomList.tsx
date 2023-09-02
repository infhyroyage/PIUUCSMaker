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
import { isOpenedMenuDrawerState, zoomIdxState } from "../service/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { ZOOM_VALUES } from "../service/zoom";

function MenuDrawerZoomList() {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const [zoomIdx, setZoomIdx] = useRecoilState<number>(zoomIdxState);

  const { listItemButtonStyle, listItemIconStyle } = useMenuDrawerStyles();

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          onClick={() => setZoomIdx(zoomIdx + 1)}
          disabled={zoomIdx === ZOOM_VALUES.length - 1}
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
          onClick={() => setZoomIdx(zoomIdx - 1)}
          disabled={zoomIdx === 0}
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
