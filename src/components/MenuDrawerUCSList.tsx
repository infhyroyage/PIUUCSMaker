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
  isOpenedMenuDrawerState,
  isOpenedNewUCSDialogState,
  isPlayingState,
  ucsNameState,
} from "../service/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  generateListItemButtonStyle,
  generateListItemIconStyle,
} from "../service/styles";
import useDownloadingUCS from "../hooks/useDownloadingUCS";

function MenuDrawerUCSList() {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const ucsName = useRecoilValue<string | null>(ucsNameState);
  const setIsOpenedNewUCSDialog = useSetRecoilState<boolean>(
    isOpenedNewUCSDialogState
  );

  const { isUploadingUCS, uploadUCS } = useUploadingUCS();
  const { isDownloadingUCS, downloadUCS } = useDownloadingUCS();

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={isPlaying || isUploadingUCS || isDownloadingUCS}
          onClick={() => setIsOpenedNewUCSDialog(true)}
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
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
          disabled={isPlaying || isUploadingUCS || isDownloadingUCS}
          htmlFor="upload-ucs"
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <input
            id="upload-ucs"
            type="file"
            accept=".ucs"
            style={{ display: "none" }}
            onChange={uploadUCS}
          />
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
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
          disabled={
            ucsName === null || isPlaying || isUploadingUCS || isDownloadingUCS
          }
          onClick={downloadUCS}
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
            <DownloadIcon />
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText
              primary={isDownloadingUCS ? "Ready..." : "Download UCS"}
              sx={{ opacity: 1 }}
            />
          )}
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default MenuDrawerUCSList;
