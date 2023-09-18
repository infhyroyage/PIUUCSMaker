import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import useUploadingUCS from "../hooks/useUploadingUCS";
import {
  chartState,
  isOpenedMenuDrawerState,
  isOpenedNewFileDialogState,
  isPlayingState,
} from "../service/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useMenuDrawerStyles from "../hooks/useMenuDrawerStyles";
import { Chart } from "../types/ucs";

function MenuDrawerFileList() {
  const chart: Chart = useRecoilValue<Chart>(chartState);
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const setIsOpenedNewChartDialog = useSetRecoilState<boolean>(
    isOpenedNewFileDialogState
  );

  const { listItemButtonStyle, listItemIconStyle } = useMenuDrawerStyles();
  const { isUploadingUCS, uploadUCS } = useUploadingUCS();

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={isPlaying || isUploadingUCS}
          onClick={() => setIsOpenedNewChartDialog(true)}
          sx={listItemButtonStyle}
        >
          <ListItemIcon sx={listItemIconStyle}>
            <AddIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary="New UCS" sx={{ opacity: 1 }} />
          )}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          component="label"
          disabled={isPlaying || isUploadingUCS}
          htmlFor="upload-ucs"
          sx={listItemButtonStyle}
        >
          <input
            id="upload-ucs"
            type="file"
            accept=".ucs"
            style={{ display: "none" }}
            onChange={uploadUCS}
          />
          <ListItemIcon sx={listItemIconStyle}>
            <UploadIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText
              primary={isUploadingUCS ? "Ready..." : "Upload UCS"}
              sx={{ opacity: 1 }}
            />
          )}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={chart.blocks.length === 0 || isPlaying || isUploadingUCS}
          onClick={() => alert("TODO")}
          sx={listItemButtonStyle}
        >
          <ListItemIcon sx={listItemIconStyle}>
            <DownloadIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary="Download UCS" sx={{ opacity: 1 }} />
          )}
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default MenuDrawerFileList;
