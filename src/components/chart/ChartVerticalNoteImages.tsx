import { memo, useMemo } from "react";
import { IMAGE_BINARIES } from "../../service/assets";
import { ChartVerticalNoteImagesProps } from "../../types/props";
import { useRecoilValue } from "recoil";
import {
  noteSizeState,
  rectangleIdentifierWidthState,
  zoomState,
} from "../../service/atoms";
import { ZOOM_VALUES } from "../../service/zoom";
import { Zoom } from "../../types/ui";

function ChartVerticalNoteImages({
  accumulatedLength,
  blockYDist,
  column,
  idx,
  split,
  type,
}: ChartVerticalNoteImagesProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const rectangleIdentifierWidth = useRecoilValue<number>(
    rectangleIdentifierWidthState
  );
  const zoom = useRecoilValue<Zoom>(zoomState);

  // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点が属する
  // 譜面のブロックの1行あたりの高さ(px単位)を計算
  const unitRowHeight = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / split,
    [noteSize, split, zoom.idx]
  );

  // 縦の枠線のサイズ(px単位)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
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
          width={`${noteSize}px`}
          height={`${noteSize}px`}
          style={{
            position: "absolute",
            top: `${top}px`,
            left: `${
              rectangleIdentifierWidth +
              verticalBorderSize * 0.5 +
              noteSize * column
            }px`,
            pointerEvents: "none",
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
            width={`${noteSize}px`}
            height={`${noteSize}px`}
            style={{
              position: "absolute",
              top: `${top}px`,
              left: `${
                rectangleIdentifierWidth +
                verticalBorderSize * 0.5 +
                noteSize * column
              }px`,
              pointerEvents: "none",
              zIndex: (idx + 1) * 10,
            }}
          />
          <img
            src={IMAGE_BINARIES[column % 5].hold}
            alt={`hold${column % 5}`}
            width={`${noteSize}px`}
            height={`${unitRowHeight}px`}
            style={{
              position: "absolute",
              top: `${top + noteSize * 0.5}px`,
              left: `${
                rectangleIdentifierWidth +
                verticalBorderSize * 0.5 +
                noteSize * column
              }px`,
              pointerEvents: "none",
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
          width={`${noteSize}px`}
          height={`${unitRowHeight}px`}
          style={{
            position: "absolute",
            top: `${top + noteSize * 0.5}px`,
            left: `${
              rectangleIdentifierWidth +
              verticalBorderSize * 0.5 +
              noteSize * column
            }px`,
            pointerEvents: "none",
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
          width={`${noteSize}px`}
          height={`${noteSize}px`}
          style={{
            position: "absolute",
            top: `${top}px`,
            left: `${
              rectangleIdentifierWidth +
              verticalBorderSize * 0.5 +
              noteSize * column
            }px`,
            zIndex: (idx + 1) * 10,
          }}
        />
      );
  }
}

export default memo(ChartVerticalNoteImages);
