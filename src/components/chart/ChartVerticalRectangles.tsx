import { memo, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { noteSizeState, zoomState } from "../../service/atoms";
import { ChartVerticalRectanglesProps } from "../../types/props";
import BorderLine from "../BorderLine";
import { Zoom } from "../../types/chart";
import { ZOOM_VALUES } from "../../service/zoom";

function ChartVerticalRectangles({
  isEven,
  isLastBlock,
  length,
  split,
}: ChartVerticalRectanglesProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  // 譜面のブロックの1行あたりの高さ(px単位)を計算
  const unitRowHeight = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / split,
    [noteSize, split, zoom.idx]
  );

  // 横の枠線のサイズ(px単位)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は1)として計算
  // ただし、譜面のブロックの高さが横の枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
  const horizontalBorderSize = useMemo(
    () =>
      Math.min(
        Math.max(Math.floor(noteSize * 0.025) * 2, 1),
        unitRowHeight * length
      ),
    [length, noteSize, unitRowHeight]
  );

  // 譜面のブロック内の1拍単位に分割する各枠線のtop値を計算
  const beatBorderLineTops = useMemo(
    () =>
      [...Array(Math.floor(length / split))].map(
        (_, beatIdx: number) =>
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx] - horizontalBorderSize) *
          (beatIdx + 1)
      ),
    [horizontalBorderSize, length, noteSize, split, zoom.idx]
  );

  return (
    <div
      style={{
        height: unitRowHeight * length,
        backgroundColor: isEven ? "rgb(255, 255, 170)" : "rgb(170, 255, 255)",
      }}
    >
      {/* 1拍ごとに分割する枠線 */}
      {beatBorderLineTops.map((top: number, idx: number) => (
        <BorderLine
          key={idx}
          style={{
            height: horizontalBorderSize,
            position: "relative",
            top,
            width: "100%",
          }}
        />
      ))}
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && (
        <BorderLine
          style={{
            height: horizontalBorderSize,
            position: "relative",
            top:
              unitRowHeight * length -
              horizontalBorderSize * (beatBorderLineTops.length + 1),
            width: "100%",
          }}
        />
      )}
    </div>
  );
}

export default memo(ChartVerticalRectangles);
