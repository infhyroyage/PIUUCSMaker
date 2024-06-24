import AddIcon from "@mui/icons-material/Add";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DownloadIcon from "@mui/icons-material/Download";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RedoIcon from "@mui/icons-material/Redo";
import StopIcon from "@mui/icons-material/Stop";
import TableChartIcon from "@mui/icons-material/TableChart";
import UndoIcon from "@mui/icons-material/Undo";
import UploadIcon from "@mui/icons-material/Upload";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Divider, Drawer, List, Theme } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useChartSnapshot from "../../hooks/useChartSnapshot";
import useDownloadingUCS from "../../hooks/useDownloadingUCS";
import usePlaying from "../../hooks/usePlaying";
import useUploadingUCS from "../../hooks/useUploadingUCS";
import { ZOOM_VALUES } from "../../services/assets";
import {
  isDarkModeState,
  isMuteBeatsState,
  isOpenedAggregateDialogState,
  isOpenedMenuDrawerState,
  isOpenedNewUCSDialogState,
  isPlayingState,
  redoSnapshotsState,
  ucsNameState,
  undoSnapshotsState,
  zoomState,
} from "../../services/atoms";
import {
  MENU_BAR_HEIGHT,
  MENU_DRAWER_OPENED_WIDTH,
} from "../../services/styles";
import { Zoom } from "../../types/menu";
import { ChartSnapshot } from "../../types/ucs";
import MenuDrawerListItem from "./MenuDrawerListItem";
import MenuDrawerUploadListItem from "./MenuDrawerUploadListItem";

function MenuDrawer() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);
  const [isMuteBeats, setIsMuteBeats] =
    useRecoilState<boolean>(isMuteBeatsState);
  const [isOpenedAggregateDialog, setIsOpenedAggregateDialog] =
    useRecoilState<boolean>(isOpenedAggregateDialogState);
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
  const { isUploadingMP3, onUploadMP3, start, stop } = usePlaying();
  const { isUploadingUCS, onUploadUCS } = useUploadingUCS();

  useEffect(() => {
    if (zoom.top !== null) scrollTo({ top: zoom.top, behavior: "instant" });
  }, [zoom]);

  // キー入力のイベントリスナーを登録し、アンマウント時に解除
  const isMac: boolean = useMemo(
    () => window.navigator.userAgent.indexOf("Mac") !== -1,
    []
  );
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "y":
          if (!isMac && event.ctrlKey) {
            handleRedo();
          }
          break;
        case "z":
          if (isMac && event.shiftKey) {
            handleRedo();
          } else if (isMac ? event.metaKey : event.ctrlKey) {
            handleUndo();
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRedo, handleUndo, isMac]);

  useEffect(
    () =>
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches),
    [setIsDarkMode]
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

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
          label="Undo"
          onClick={handleUndo}
        />
        <MenuDrawerListItem
          disabled={redoSnapshots.length === 0 || isPlaying}
          icon={<RedoIcon />}
          label="Redo"
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
          disabled={ucsName === null || isPlaying}
          icon={<TableChartIcon />}
          label="Aggregate"
          onClick={() => setIsOpenedAggregateDialog(!isOpenedAggregateDialog)}
        />
        <MenuDrawerListItem
          icon={
            <label className="swap swap-rotate">
              {/* heroicon "sun" and "moon" */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-6 ${isDarkMode ? "swap-on" : "swap-off"}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isDarkMode
                      ? "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                      : "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  }
                />
              </svg>
            </label>
          }
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
