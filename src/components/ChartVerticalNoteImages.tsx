import { memo } from "react";
import useChartSizes from "../hooks/useChartSizes";
import { IMAGE_BINARIES } from "../service/assets";
import { ChartVerticalNoteImagesProps } from "../types/props";

function ChartVerticalNoteImages({
  column,
  goalTop,
  startTop,
  startZIndex,
}: ChartVerticalNoteImagesProps) {
  const { noteSize } = useChartSizes();

  return (
    <>
      {/* 単ノート/ホールドの始点の画像 */}
      <img
        src={IMAGE_BINARIES[column % 5].note}
        alt={`note${column % 5}`}
        width={noteSize}
        height={noteSize}
        style={{
          position: "absolute",
          top: `${startTop}px`,
          zIndex: startZIndex,
        }}
      />
      {startTop < goalTop && (
        <>
          {/* ホールドの画像 */}
          <img
            src={IMAGE_BINARIES[column % 5].hold}
            alt={`hold${column % 5}`}
            width={noteSize}
            height={goalTop - startTop}
            style={{
              position: "absolute",
              top: `${startTop + noteSize * 0.5}px`,
              zIndex: startZIndex + 1,
            }}
          />
          {/* ホールドの終点の画像 */}
          <img
            src={IMAGE_BINARIES[column % 5].note}
            alt={`note${column % 5}`}
            width={noteSize}
            height={noteSize}
            style={{
              position: "absolute",
              top: `${goalTop}px`,
              zIndex: startZIndex + 2,
            }}
          />
        </>
      )}
    </>
  );
}

export default memo(ChartVerticalNoteImages);
