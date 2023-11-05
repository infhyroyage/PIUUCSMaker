import { memo, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { noteSizeState, zoomState } from "../../services/atoms";
import { ChartVerticalRectanglesProps } from "../../types/props";
import BorderLine from "./BorderLine";
import { Zoom } from "../../types/menu";
import { ZOOM_VALUES } from "../../services/zoom";

function ChartVerticalRectangles({
  isEven,
  isLastBlock,
  rows,
  split,
}: ChartVerticalRectanglesProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  // 譜面のブロックの1行あたりの高さ(px)を計算
  const unitRowHeight = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / split,
    [noteSize, split, zoom.idx]
  );

  // 横の枠線のサイズ(px)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  // ただし、譜面のブロックの高さが横の枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
  const horizontalBorderSize = useMemo(
    () =>
      Math.min(
        Math.max(Math.floor(noteSize * 0.025) * 2, 2),
        unitRowHeight * rows
      ),
    [rows, noteSize, unitRowHeight]
  );

  // 譜面のブロック内の1拍単位に分割する各枠線のtop値を(px)計算
  const beatBorderLineTops = useMemo(
    () =>
      [...Array(Math.floor(rows / split))].map(
        (_, beatIdx: number) =>
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx] - horizontalBorderSize) *
          (beatIdx + 1)
      ),
    [horizontalBorderSize, rows, noteSize, split, zoom.idx]
  );

  return (
    <div
      style={{
        height: `${unitRowHeight * rows}px`,
        backgroundColor: isEven ? "rgb(255, 255, 170)" : "rgb(170, 255, 255)",
      }}
    >
      {/* 1拍ごとに分割する枠線 */}
      {beatBorderLineTops.map((top: number, idx: number) => (
        <BorderLine
          key={idx}
          style={{
            height: `${horizontalBorderSize}px`,
            position: "relative",
            top: `${top}px`,
            width: "100%",
          }}
        />
      ))}
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && (
        <BorderLine
          style={{
            height: `${horizontalBorderSize}px`,
            position: "relative",
            top: `${
              unitRowHeight * rows -
              horizontalBorderSize * (beatBorderLineTops.length + 1)
            }px`,
            width: "100%",
          }}
        />
      )}
    </div>
  );
}

export default memo(ChartVerticalRectangles);
