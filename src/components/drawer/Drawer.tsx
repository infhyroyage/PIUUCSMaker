import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useChartSnapshot from "../../hooks/useChartSnapshot";
import useDownloadingUCS from "../../hooks/useDownloadingUCS";
import useNewUcsDialog from "../../hooks/useNewUcsDialog";
import usePlaying from "../../hooks/usePlaying";
import { useStore } from "../../hooks/useStore";
import useUploadingUCS from "../../hooks/useUploadingUCS";
import { ZOOM_VALUES } from "../../services/assets";
import {
  redoSnapshotsState,
  undoSnapshotsState,
  zoomState,
} from "../../services/atoms";
import {
  DRAWER_OPENED_WIDTH,
  DRAWER_Z_INDEX,
  NAVIGATION_BAR_HEIGHT,
} from "../../services/styles";
import { Zoom } from "../../types/menu";
import { ChartSnapshot } from "../../types/ucs";
import DrawerListItem from "./DrawerListItem";
import DrawerUploadListItem from "./DrawerUploadListItem";

function Drawer() {
  const {
    isDarkMode,
    toggleIsDarkMode,
    isMuteBeats,
    toggleIsMuteBeats,
    isPlaying,
    ucsName,
  } = useStore();
  const [zoom, setZoom] = useRecoilState<Zoom>(zoomState);
  const redoSnapshots = useRecoilValue<ChartSnapshot[]>(redoSnapshotsState);
  const undoSnapshots = useRecoilValue<ChartSnapshot[]>(undoSnapshotsState);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const { handleRedo, handleUndo } = useChartSnapshot();
  const { isDownloadingUCS, downloadUCS } = useDownloadingUCS();
  const { openNewUcsDialog } = useNewUcsDialog();
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

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  return (
    <div
      className="fixed bg-base-200 duration-300 flex flex-col whitespace-nowrap box-border shadow-lg"
      style={{
        width: `${isOpened ? DRAWER_OPENED_WIDTH : NAVIGATION_BAR_HEIGHT}px`,
        height: `calc(100vh - ${NAVIGATION_BAR_HEIGHT}px)`,
        zIndex: DRAWER_Z_INDEX,
      }}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="menu w-full p-0">
          <DrawerListItem
            disabled={isPlaying || isUploadingUCS || isDownloadingUCS}
            icon={
              // heroicons "plus"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            }
            label="New UCS"
            onClick={openNewUcsDialog}
          />
          <DrawerUploadListItem
            disabled={isPlaying || isUploadingUCS || isDownloadingUCS}
            extension=".ucs"
            icon={
              // heroicons "arrow-up-tray"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
            }
            id="upload-ucs"
            label={isUploadingUCS ? "Ready..." : "Upload UCS"}
            onChange={onUploadUCS}
          />
          <DrawerListItem
            disabled={
              ucsName === null ||
              isPlaying ||
              isUploadingUCS ||
              isDownloadingUCS
            }
            icon={
              // heroicons "arrow-down-tray"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            }
            label={isDownloadingUCS ? "Ready..." : "Download UCS"}
            onClick={downloadUCS}
          />
          <div className="divider my-0" />
          <DrawerListItem
            disabled={undoSnapshots.length === 0 || isPlaying}
            icon={
              // heroicons "arrow-uturn-left"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            }
            label="Undo"
            onClick={handleUndo}
          />
          <DrawerListItem
            disabled={redoSnapshots.length === 0 || isPlaying}
            icon={
              // heroicons "arrow-uturn-right"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                />
              </svg>
            }
            label="Redo"
            onClick={handleRedo}
          />
          <div className="divider my-0" />
          <DrawerListItem
            disabled={zoom.idx === ZOOM_VALUES.length - 1 || isPlaying}
            icon={
              // heroicons "magnifying-glass-plus"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                />
              </svg>
            }
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
          <DrawerListItem
            disabled={zoom.idx === 0 || isPlaying}
            icon={
              // heroicons "magnifying-glass-minus"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"
                />
              </svg>
            }
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
          <div className="divider my-0" />
          <DrawerUploadListItem
            disabled={isPlaying || isUploadingMP3}
            extension=".mp3"
            icon={
              // heroicons "musical-note"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
                />
              </svg>
            }
            id="upload-mp3"
            label={isUploadingUCS ? "Ready..." : "Upload MP3"}
            onChange={onUploadMP3}
          />
          <DrawerListItem
            icon={
              // heroicons "bell-slash" and "bell"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isMuteBeats
                      ? "M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
                      : "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  }
                />
              </svg>
            }
            label={isMuteBeats ? "Mute Beats" : "Unmute Beats"}
            onClick={toggleIsMuteBeats}
          />
          <DrawerListItem
            disabled={ucsName === null || isUploadingMP3}
            icon={
              // heroicons "pause" and "play"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isPlaying
                      ? "M15.75 5.25v13.5m-7.5-13.5v13.5"
                      : "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                  }
                />
              </svg>
            }
            label={isPlaying ? "Stop" : "Play"}
            onClick={() => (isPlaying ? stop() : start())}
          />
          <div className="divider my-0" />
          <DrawerListItem
            disabled={ucsName === null || isPlaying}
            icon={
              // heroicons "document-text"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            }
            label="Aggregate"
            onClick={() => {
              const aggregateDialog =
                document.getElementById("aggregate-dialog");
              if (aggregateDialog) {
                (aggregateDialog as HTMLDialogElement).showModal();
              }
            }}
          />
          <DrawerListItem
            icon={
              // heroicon "sun" and "moon"
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
            }
            label={isDarkMode ? "Dark" : "Light"}
            onClick={toggleIsDarkMode}
          />
        </ul>
      </div>
      <div className="flex overflow-hidden">
        <ul className="menu w-full p-0">
          <div className="divider my-0" />
          <DrawerListItem
            icon={
              // heroicons "chevron-left" and "chevron-right"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isOpened
                      ? "M15.75 19.5 8.25 12l7.5-7.5"
                      : "m8.25 4.5 7.5 7.5-7.5 7.5"
                  }
                />
              </svg>
            }
            label={isOpened ? "Fold" : "Expand"}
            onClick={() => setIsOpened(!isOpened)}
          />
        </ul>
      </div>
    </div>
  );
}

export default Drawer;
