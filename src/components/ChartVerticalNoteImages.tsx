import { memo } from "react";
import { IMAGE_BINARIES } from "../service/assets";
import { ChartVerticalNoteImagesProps } from "../types/props";
import { useRecoilValue } from "recoil";
import { noteSizeState } from "../service/atoms";

function ChartVerticalNoteImages({
  column,
  idx,
  y,
  type,
  unitRowHeight,
}: ChartVerticalNoteImagesProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);

  switch (type) {
    case "X":
      // 単ノートの画像
      return (
        <img
          src={IMAGE_BINARIES[column % 5].note}
          alt={`note${column % 5}`}
          width={noteSize}
          height={noteSize}
          style={{
            position: "absolute",
            top: y,
            zIndex: (idx + 1) * 10,
          }}
        />
      );
    case "M":
      // ホールドの始点の画像
      return (
        <>
          <img
            src={IMAGE_BINARIES[column % 5].note}
            alt={`note${column % 5}`}
            width={noteSize}
            height={noteSize}
            style={{
              position: "absolute",
              top: y,
              zIndex: (idx + 1) * 10,
            }}
          />
          <img
            src={IMAGE_BINARIES[column % 5].hold}
            alt={`hold${column % 5}`}
            width={noteSize}
            height={unitRowHeight}
            style={{
              position: "absolute",
              top: y + noteSize * 0.5,
              zIndex: (idx + 1) * 10 + 1,
            }}
          />
        </>
      );
    case "H":
      // ホールドの画像
      return (
        <img
          src={IMAGE_BINARIES[column % 5].hold}
          alt={`hold${column % 5}`}
          width={noteSize}
          height={unitRowHeight}
          style={{
            position: "absolute",
            top: y + noteSize * 0.5,
            zIndex: (idx + 1) * 10,
          }}
        />
      );
    case "W":
      // ホールドの終点の画像
      return (
        <img
          src={IMAGE_BINARIES[column % 5].note}
          alt={`note${column % 5}`}
          width={noteSize}
          height={noteSize}
          style={{
            position: "absolute",
            top: y,
            zIndex: (idx + 1) * 10,
          }}
        />
      );
  }
}

export default memo(ChartVerticalNoteImages);
