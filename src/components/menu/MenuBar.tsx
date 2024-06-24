import { Slider } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ZOOM_VALUES } from "../../services/assets";
import {
  isPlayingState,
  isProtectedState,
  volumeValueState,
  zoomState,
} from "../../services/atoms";
import { MENU_BAR_HEIGHT } from "../../services/styles";
import { Zoom } from "../../types/menu";
import MenuBarTitle from "./MenuBarTitle";

function MenuBar() {
  const [muteVolBuf, setMuteVolBuf] = useState<number | null>(null);
  const [volumeValue, setVolumeValue] =
    useRecoilState<number>(volumeValueState);
  const [zoom, setZoom] = useRecoilState<Zoom>(zoomState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const isProtected = useRecoilValue<boolean>(isProtectedState);

  const onClickVolumeButton = useCallback(() => {
    if (muteVolBuf === null) {
      setMuteVolBuf(volumeValue);
      setVolumeValue(0);
    } else {
      setVolumeValue(muteVolBuf);
      setMuteVolBuf(null);
    }
  }, [muteVolBuf, setMuteVolBuf, setVolumeValue, volumeValue]);

  // 編集中に離脱した場合、その離脱を抑止する組込みダイアログを表示
  useEffect(() => {
    const handleBeforeunload = (event: BeforeUnloadEvent) =>
      event.preventDefault();
    if (isProtected) {
      window.addEventListener("beforeunload", handleBeforeunload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeunload);
      };
    } else {
      window.removeEventListener("beforeunload", handleBeforeunload);
    }
  }, [isProtected]);

  return (
    <div
      className="navbar bg-base-300 fixed top-0 w-full py-0 min-h-0"
      style={{
        height: `${MENU_BAR_HEIGHT}px`,
        zIndex: 1100000,
      }}
    >
      <MenuBarTitle />
      <form className="flex items-center gap-0 md:gap-1">
        <select
          className="select select-sm select-bordered bg-base-300"
          disabled={isPlaying}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setZoom({
              idx: Number(event.target.value),
              top:
                (document.documentElement.scrollTop *
                  ZOOM_VALUES[Number(event.target.value)]) /
                ZOOM_VALUES[zoom.idx],
            })
          }
          value={`${zoom.idx}`}
        >
          {ZOOM_VALUES.map((zoomValue: number, idx: number) => (
            <option key={idx} value={`${idx}`}>{`${zoomValue}x`}</option>
          ))}
        </select>
        <div className="flex items-center gap-0 md:gap-1">
          <button
            className="btn btn-sm btn-ghost"
            onClick={onClickVolumeButton}
          >
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
                  muteVolBuf !== null || volumeValue === 0
                    ? "M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                    : "M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                }
              />
            </svg>
          </button>
          <Slider
            disabled={muteVolBuf !== null}
            max={1}
            min={0}
            onChange={(_, value: number | number[]) => {
              setVolumeValue(value as number);
            }}
            size="small"
            step={0.01}
            sx={{ width: `${MENU_BAR_HEIGHT}px`, color: "white" }}
            value={muteVolBuf || volumeValue}
          />
        </div>
      </form>
    </div>
  );
}

export default MenuBar;
