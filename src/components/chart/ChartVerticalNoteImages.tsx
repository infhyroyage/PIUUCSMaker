import { memo, useMemo } from "react";
import { IMAGE_BINARIES } from "../../service/assets";
import { ChartVerticalNoteImagesProps } from "../../types/props";
import { useRecoilValue } from "recoil";
import { noteSizeState, zoomState } from "../../service/atoms";
import { ZOOM_VALUES } from "../../service/zoom";
import { Zoom } from "../../types/chart";

function ChartVerticalNoteImages({
  accumulatedLength,
  blockYDist,
  column,
  idx,
  split,
  type,
}: ChartVerticalNoteImagesProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点が属する
  // 譜面のブロックの1行あたりの高さ(px単位)を計算
  const unitRowHeight = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / split,
    [noteSize, split, zoom.idx]
  );

  // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点の譜面全体での行インデックスでの
  // ブラウザの画面のy座標(px単位)を計算
  const top = useMemo(
    () => blockYDist + unitRowHeight * (idx - accumulatedLength),
    [accumulatedLength, blockYDist, idx, unitRowHeight]
  );

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
            top,
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
              top,
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
              top: top + noteSize * 0.5,
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
            top: top + noteSize * 0.5,
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
            top,
            zIndex: (idx + 1) * 10,
          }}
        />
      );
  }
}

export default memo(ChartVerticalNoteImages);
