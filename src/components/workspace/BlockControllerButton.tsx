import { memo, useMemo } from "react";
import { useStore } from "../../hooks/useStore";
import { ZOOM_VALUES } from "../../services/assets";
import { BlockControllerButtonProps } from "../../types/props";
import BorderLine from "./BorderLine";

function BlockControllerButton({
  bpm,
  delay,
  isFirstBlock,
  isLastBlock,
  onClick,
  rows,
  split,
}: BlockControllerButtonProps) {
  const { noteSize, zoom } = useStore();

  // true if Delay is ignored except the first chart block, otherwise false
  const isIgnoredDelay: boolean = useMemo(
    () => !isFirstBlock && delay !== 0,
    [delay, isFirstBlock]
  );

  // Height (px) of chart block
  const blockHeight: number = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoom.idx] * rows) / split,
    [noteSize, rows, split, zoom.idx]
  );

  // Calculate horizontal border size (px) as 0.05 times noteSize, rounded down to even number, with a minimum value of 2
  // However, if chart block height is smaller than horizontal border size, use chart block height
  const horizontalBorderSize = useMemo(
    () => Math.min(Math.max(Math.floor(noteSize * 0.025) * 2, 2), blockHeight),
    [blockHeight, noteSize]
  );

  return (
    <>
      <button
        className="btn-square btn-ghost bg-base-200 w-full border-y-0 px-0 md:px-2 py-0 flex flex-col overflow-hidden"
        onClick={onClick}
        style={{
          height: `${
            isLastBlock ? blockHeight : blockHeight - horizontalBorderSize
          }px`,
        }}
      >
        <div className="text-xs text-left overflow-hidden text-ellipsis">
          <p>{`${bpm} BPM, 1/${split}`}</p>
          <p
            className={isIgnoredDelay ? "text-warning" : undefined}
          >{`Delay: ${delay} (ms)${isIgnoredDelay ? " ⚠" : ""}`}</p>
        </div>
      </button>
      {/* Border to split each chart block */}
      {!isLastBlock && (
        <BorderLine
          style={{ height: `${horizontalBorderSize}px`, width: "100%" }}
        />
      )}
    </>
  );
}

export default memo(BlockControllerButton);
