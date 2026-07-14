import { memo, useMemo } from "react";
import { useStore } from "../../hooks/useStore";
import { ZOOM_VALUES } from "../../services/assets";
import { ChartVerticalRectanglesProps } from "../../types/props";
import BorderLine from "./BorderLine";

function ChartVerticalRectangles({
  isEven,
  isLastBlock,
  rows,
  split,
}: ChartVerticalRectanglesProps) {
  const { noteSize, zoom } = useStore();

  // Calculate height (px) per row of chart block
  const unitRowHeight = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / split,
    [noteSize, split, zoom.idx]
  );

  // Calculate horizontal border size (px) as 0.05 times noteSize, rounded down to even, with a minimum value of 2
  // However, use the same value as chart block height if chart block height is smaller than horizontal border size
  const horizontalBorderSize = useMemo(
    () =>
      Math.min(
        Math.max(Math.floor(noteSize * 0.025) * 2, 2),
        unitRowHeight * rows
      ),
    [rows, noteSize, unitRowHeight]
  );

  // Calculate top (px) of each border that separates by one beat in chart block
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
      {/* Border that separates by one beat */}
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
      {/* Border that separates each chart block */}
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
