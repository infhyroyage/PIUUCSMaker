import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useStore } from "../../hooks/useStore";
import { ZOOM_VALUES } from "../../services/assets";
import {
  NAVIGATION_BAR_HEIGHT,
  NAVIGATION_BAR_Z_INDEX,
} from "../../services/styles";
import NavigationBarTitle from "./NavigationBarTitle";

function NavigationBar() {
  const {
    isPlaying,
    isProtected,
    volumeValue,
    setVolumeValue,
    zoom,
    updateZoomFromIdx,
  } = useStore();
  const [muteVolBuf, setMuteVolBuf] = useState<number | null>(null);

  const onChangeSelect = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      // formを送信せず、ページ遷移を行わないようにする
      event.preventDefault();

      updateZoomFromIdx(Number(event.target.value));
    },
    [updateZoomFromIdx]
  );

  const onClickVolumeButton = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // formを送信せず、ページ遷移を行わないようにする
      event.preventDefault();

      if (muteVolBuf === null) {
        setMuteVolBuf(volumeValue);
        setVolumeValue(0);
      } else {
        setVolumeValue(muteVolBuf);
        setMuteVolBuf(null);
      }
    },
    [muteVolBuf, setMuteVolBuf, setVolumeValue, volumeValue]
  );

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
      className="navbar bg-base-300 fixed top-0 w-full px-2 md:px-4 py-0 min-h-0 shadow-lg"
      style={{
        height: `${NAVIGATION_BAR_HEIGHT}px`,
        zIndex: NAVIGATION_BAR_Z_INDEX,
      }}
    >
      <div className="flex-1">
        <NavigationBarTitle />
      </div>
      <form className="flex items-center gap-0 md:gap-1">
        <select
          className="select select-sm bg-base-300"
          disabled={isPlaying}
          onChange={onChangeSelect}
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
            {/* heroicons "speaker-x-mark" and "speaker-wave" */}
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
          <input
            className="range range-xs w-20"
            disabled={muteVolBuf !== null}
            max={1}
            min={0}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setVolumeValue(Number(event.target.value))
            }
            step={0.01}
            type="range"
            value={muteVolBuf || volumeValue}
          />
        </div>
      </form>
    </div>
  );
}

export default NavigationBar;
