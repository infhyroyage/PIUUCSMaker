import { memo } from "react";
import { IMAGE_BINARIES } from "../service/assets";
import { ChartVerticalNoteImagesProps } from "../types/props";
import { useRecoilValue } from "recoil";
import { noteSizeState } from "../service/atoms";

function ChartVerticalNoteImages({
  column,
  goalTop,
  startTop,
  startZIndex,
}: ChartVerticalNoteImagesProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);

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
          top: startTop,
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
              top: startTop + noteSize * 0.5,
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
              top: goalTop,
              zIndex: startZIndex + 2,
            }}
          />
        </>
      )}
    </>
  );
}

export default memo(ChartVerticalNoteImages);
