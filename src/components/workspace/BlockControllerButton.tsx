import { memo, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ZOOM_VALUES } from "../../services/assets";
import { noteSizeState, zoomState } from "../../services/atoms";
import { Zoom } from "../../types/menu";
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
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  // 最初以外の譜面のブロックの場合はDelay値を無視する警告フラグ
  const isIgnoredDelay: boolean = useMemo(
    () => !isFirstBlock && delay !== 0,
    [delay, isFirstBlock]
  );

  // 譜面のブロックの高さ(px)
  const blockHeight: number = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoom.idx] * rows) / split,
    [noteSize, rows, split, zoom.idx]
  );

  // 横の枠線のサイズ(px)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  // ただし、譜面のブロックの高さが横の枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
  const horizontalBorderSize = useMemo(
    () => Math.min(Math.max(Math.floor(noteSize * 0.025) * 2, 2), blockHeight),
    [blockHeight, noteSize]
  );

  return (
    <>
      <button
        className="btn-square btn-ghost bg-base-200 w-full px-0 md:px-2 py-0 flex flex-col overflow-hidden"
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
            className={isIgnoredDelay ? "text-error" : undefined}
          >{`Delay: ${delay} (ms)${isIgnoredDelay ? " ⚠" : ""}`}</p>
        </div>
      </button>
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && (
        <BorderLine
          style={{ height: `${horizontalBorderSize}px`, width: "100%" }}
        />
      )}
    </>
  );
}

export default memo(BlockControllerButton);
