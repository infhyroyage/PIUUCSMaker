import { useEffect } from "react";
import { Divider, Drawer, List, Theme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isDarkModeState,
  isMuteBeatsState,
  isOpenedMenuDrawerState,
  isOpenedNewUCSDialogState,
  isPlayingState,
  redoSnapshotsState,
  ucsNameState,
  undoSnapshotsState,
  zoomState,
} from "../../services/atoms";
import MenuDrawerListItem from "./MenuDrawerListItem";
import { Zoom } from "../../types/menu";
import { ChartSnapshot } from "../../types/ucs";
import { ZOOM_VALUES } from "../../services/zoom";
import {
  MENU_BAR_HEIGHT,
  MENU_DRAWER_OPENED_WIDTH,
} from "../../services/styles";
import usePlayingMusic from "../../hooks/usePlayingMusic";
import useUploadingUCS from "../../hooks/useUploadingUCS";
import useDownloadingUCS from "../../hooks/useDownloadingUCS";
import MenuDrawerUploadListItem from "./MenuDrawerUploadListItem";
import useChartSnapshot from "../../hooks/useChartSnapshot";

function MenuDrawer() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);
  const [isMuteBeats, setIsMuteBeats] =
    useRecoilState<boolean>(isMuteBeatsState);
  const [isOpenedMenuDrawer, setIsOpenedMenuDrawer] = useRecoilState<boolean>(
    isOpenedMenuDrawerState
  );
  const [zoom, setZoom] = useRecoilState<Zoom>(zoomState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const redoSnapshots = useRecoilValue<ChartSnapshot[]>(redoSnapshotsState);
  const ucsName = useRecoilValue<string | null>(ucsNameState);
  const undoSnapshots = useRecoilValue<ChartSnapshot[]>(undoSnapshotsState);
  const setIsOpenedNewUCSDialog = useSetRecoilState<boolean>(
    isOpenedNewUCSDialogState
  );

  const { isDownloadingUCS, downloadUCS } = useDownloadingUCS();
  const { handleRedo, handleUndo } = useChartSnapshot();
  const { isUploadingMP3, onUploadMP3, start, stop } = usePlayingMusic();
  const { isUploadingUCS, onUploadUCS } = useUploadingUCS();

  useEffect(() => {
    if (zoom.top !== null) scrollTo({ top: zoom.top });
  }, [zoom]);

  return (
    <Drawer
      variant="permanent"
      open={isOpenedMenuDrawer}
      PaperProps={{ elevation: 3, height: "100%" }}
      sx={(theme: Theme) => ({
        width: `${
          isOpenedMenuDrawer ? MENU_DRAWER_OPENED_WIDTH : MENU_BAR_HEIGHT
        }px`,
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
          width: `${
            isOpenedMenuDrawer ? MENU_DRAWER_OPENED_WIDTH : MENU_BAR_HEIGHT
          }px`,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: isOpenedMenuDrawer
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        },
      })}
    >
      <List sx={{ flexGrow: 1, overflow: "auto" }}>
        <MenuDrawerListItem
          disabled={isPlaying || isUploadingUCS || isDownloadingUCS}
          icon={<AddIcon />}
          label="New UCS"
          onClick={() => setIsOpenedNewUCSDialog(true)}
        />
        <MenuDrawerUploadListItem
          disabled={isPlaying || isUploadingUCS || isDownloadingUCS}
          extension=".ucs"
          icon={<UploadIcon />}
          id="upload-ucs"
          label={isUploadingUCS ? "Ready..." : "Upload UCS"}
          onChange={onUploadUCS}
        />
        <MenuDrawerListItem
          disabled={
            ucsName === null || isPlaying || isUploadingUCS || isDownloadingUCS
          }
          icon={<DownloadIcon />}
          label={isDownloadingUCS ? "Ready..." : "Download UCS"}
          onClick={downloadUCS}
        />
        <Divider />
        <MenuDrawerListItem
          disabled={undoSnapshots.length === 0 || isPlaying}
          icon={<UndoIcon />}
          label="Undo (Ctrl+Z)"
          onClick={handleUndo}
        />
        <MenuDrawerListItem
          disabled={redoSnapshots.length === 0 || isPlaying}
          icon={<RedoIcon />}
          label="Redo (Ctrl+Y)"
          onClick={handleRedo}
        />
        <Divider />
        <MenuDrawerListItem
          disabled={zoom.idx === ZOOM_VALUES.length - 1 || isPlaying}
          icon={<ZoomInIcon />}
          label="Zoom In"
          onClick={() =>
            setZoom({
              idx: zoom.idx + 1,
              top:
                (document.documentElement.scrollTop *
                  ZOOM_VALUES[zoom.idx + 1]) /
                ZOOM_VALUES[zoom.idx],
            })
          }
        />
        <MenuDrawerListItem
          disabled={zoom.idx === 0 || isPlaying}
          icon={<ZoomOutIcon />}
          label="Zoom Out"
          onClick={() =>
            setZoom({
              idx: zoom.idx - 1,
              top:
                (document.documentElement.scrollTop *
                  ZOOM_VALUES[zoom.idx - 1]) /
                ZOOM_VALUES[zoom.idx],
            })
          }
        />
        <Divider />
        <MenuDrawerUploadListItem
          disabled={isPlaying || isUploadingMP3}
          extension=".mp3"
          icon={<AudioFileIcon />}
          id="upload-mp3"
          label={isUploadingUCS ? "Ready..." : "Upload MP3"}
          onChange={onUploadMP3}
        />
        <MenuDrawerListItem
          icon={isMuteBeats ? <MusicOffIcon /> : <MusicNoteIcon />}
          label={isMuteBeats ? "Mute Beats" : "Unmute Beats"}
          onClick={() => setIsMuteBeats(!isMuteBeats)}
        />
        <MenuDrawerListItem
          disabled={ucsName === null || isUploadingMP3}
          icon={isPlaying ? <StopIcon /> : <PlayArrowIcon />}
          label={isPlaying ? "Stop" : "Play"}
          onClick={() => (isPlaying ? stop() : start())}
        />
        <Divider />
        <MenuDrawerListItem
          icon={isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
          label={isDarkMode ? "Dark" : "Light"}
          onClick={() => setIsDarkMode(!isDarkMode)}
        />
      </List>
      <List sx={{ marginTop: "auto" }}>
        <Divider />
        <MenuDrawerListItem
          icon={isOpenedMenuDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          label={isOpenedMenuDrawer ? "Fold" : "Expand"}
          onClick={() => setIsOpenedMenuDrawer(!isOpenedMenuDrawer)}
        />
      </List>
    </Drawer>
  );
}

export default MenuDrawer;
