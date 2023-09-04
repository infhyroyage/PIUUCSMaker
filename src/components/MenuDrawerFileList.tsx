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
import useOpenFile from "../hooks/useOpenFile";
import {
  isOpenedMenuDrawerState,
  isOpenedNewFileDialogState,
} from "../service/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useMenuDrawerStyles from "../hooks/useMenuDrawerStyles";

function MenuDrawerFileList() {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const setIsOpenedNewChartDialog = useSetRecoilState<boolean>(
    isOpenedNewFileDialogState
  );

  const { isOpeningFile, handleOpenFile } = useOpenFile();
  const { listItemButtonStyle, listItemIconStyle } = useMenuDrawerStyles();

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
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
          htmlFor="upload-ucs"
          disabled={isOpeningFile}
          sx={listItemButtonStyle}
        >
          <input
            id="upload-ucs"
            type="file"
            accept=".ucs"
            style={{ display: "none" }}
            onChange={handleOpenFile}
          />
          <ListItemIcon sx={listItemIconStyle}>
            <UploadIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary="Upload UCS" sx={{ opacity: 1 }} />
          )}
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton onClick={() => alert("TODO")} sx={listItemButtonStyle}>
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
