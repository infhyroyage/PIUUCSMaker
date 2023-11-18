import { memo, useMemo } from "react";
import { ChartVerticalNoteImagesProps } from "../../types/props";
import { useRecoilValue } from "recoil";
import { noteSizeState, zoomState } from "../../services/atoms";
import {
  HOLD_BINARIES,
  NOTE_BINARIES,
  ZOOM_VALUES,
} from "../../services/assets";
import { Zoom } from "../../types/menu";
import { IDENTIFIER_WIDTH } from "../../services/styles";
import useVerticalBorderSize from "../../hooks/useVerticalBorderSize";

function ChartVerticalNoteImages({
  accumulatedRows,
  blockYDist,
  column,
  rowIdx,
  split,
  type,
}: ChartVerticalNoteImagesProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  const verticalBorderSize = useVerticalBorderSize();

  // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点が属する
  // 譜面のブロックの1行あたりの高さ(px)を計算
  const unitRowHeight = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / split,
    [noteSize, split, zoom.idx]
  );

  // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点の譜面全体での行インデックスでの
  // ブラウザの画面のy座標(px)を計算
  const top = useMemo(
    () => blockYDist + unitRowHeight * (rowIdx - accumulatedRows),
    [accumulatedRows, blockYDist, rowIdx, unitRowHeight]
  );

  switch (type) {
    case "X":
      return (
        <img
          src={NOTE_BINARIES[column % 5]}
          alt={`note${column % 5}`}
          width={`${noteSize}px`}
          height={`${noteSize}px`}
          style={{
            position: "absolute",
            top: `${top}px`,
            left: `${
              IDENTIFIER_WIDTH + verticalBorderSize * 0.5 + noteSize * column
            }px`,
            userSelect: "none",
            zIndex: (rowIdx + 1) * 10,
          }}
          onDragStart={(event: React.DragEvent<HTMLImageElement>) =>
            event.preventDefault()
          }
        />
      );
    case "M":
      return (
        <>
          <img
            src={NOTE_BINARIES[column % 5]}
            alt={`note${column % 5}`}
            width={`${noteSize}px`}
            height={`${noteSize}px`}
            style={{
              position: "absolute",
              top: `${top}px`,
              left: `${
                IDENTIFIER_WIDTH + verticalBorderSize * 0.5 + noteSize * column
              }px`,
              userSelect: "none",
              zIndex: (rowIdx + 1) * 10,
            }}
            onDragStart={(event: React.DragEvent<HTMLImageElement>) =>
              event.preventDefault()
            }
          />
          <img
            src={HOLD_BINARIES[column % 5]}
            alt={`hold${column % 5}`}
            width={`${noteSize}px`}
            height={`${unitRowHeight - noteSize * 0.5}px`}
            style={{
              position: "absolute",
              top: `${top + noteSize * 0.5}px`,
              left: `${
                IDENTIFIER_WIDTH + verticalBorderSize * 0.5 + noteSize * column
              }px`,
              userSelect: "none",
              zIndex: (rowIdx + 1) * 10 + 1,
            }}
            onDragStart={(event: React.DragEvent<HTMLImageElement>) =>
              event.preventDefault()
            }
          />
        </>
      );
    case "H":
      return (
        <img
          src={HOLD_BINARIES[column % 5]}
          alt={`hold${column % 5}`}
          width={`${noteSize}px`}
          height={`${unitRowHeight}px`}
          style={{
            position: "absolute",
            top: `${top}px`,
            left: `${
              IDENTIFIER_WIDTH + verticalBorderSize * 0.5 + noteSize * column
            }px`,
            userSelect: "none",
            zIndex: (rowIdx + 1) * 10,
          }}
          onDragStart={(event: React.DragEvent<HTMLImageElement>) =>
            event.preventDefault()
          }
        />
      );
    case "W":
      return (
        <>
          <img
            src={HOLD_BINARIES[column % 5]}
            alt={`hold${column % 5}`}
            width={`${noteSize}px`}
            height={`${noteSize * 0.5}px`}
            style={{
              position: "absolute",
              top: `${top}px`,
              left: `${
                IDENTIFIER_WIDTH + verticalBorderSize * 0.5 + noteSize * column
              }px`,
              userSelect: "none",
              zIndex: (rowIdx + 1) * 10 - 1,
            }}
            onDragStart={(event: React.DragEvent<HTMLImageElement>) =>
              event.preventDefault()
            }
          />
          <img
            src={NOTE_BINARIES[column % 5]}
            alt={`note${column % 5}`}
            width={`${noteSize}px`}
            height={`${noteSize}px`}
            style={{
              position: "absolute",
              top: `${top}px`,
              left: `${
                IDENTIFIER_WIDTH + verticalBorderSize * 0.5 + noteSize * column
              }px`,
              userSelect: "none",
              zIndex: (rowIdx + 1) * 10,
            }}
            onDragStart={(event: React.DragEvent<HTMLImageElement>) =>
              event.preventDefault()
            }
          />
        </>
      );
  }
}

export default memo(ChartVerticalNoteImages);
