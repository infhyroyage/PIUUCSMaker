import { memo, useMemo, useState } from "react";
import { ChartBlockRectangleProps } from "../types/props";
import Note0 from "../images/note0.png";
import Note1 from "../images/note1.png";
import Note2 from "../images/note2.png";
import Note3 from "../images/note3.png";
import Note4 from "../images/note4.png";
import Hold0 from "../images/hold0.png";
import Hold1 from "../images/hold1.png";
import Hold2 from "../images/hold2.png";
import Hold3 from "../images/hold3.png";
import Hold4 from "../images/hold4.png";
import { Note } from "../types/ucs";
import { useRecoilValue } from "recoil";
import { zoomIdxState } from "../service/atoms";
import { ZOOM_VALUES } from "../service/zoom";
import ChartBorderLine from "./ChartBorderLine";

// 単ノート・ホールドの画像ファイルのバイナリデータ
const NOTE_SRCS: string[] = [Note0, Note1, Note2, Note3, Note4];
const HOLD_SRCS: string[] = [Hold0, Hold1, Hold2, Hold3, Hold4];

function ChartBlockRectangle({
  column,
  isEvenIdx,
  blockHeight,
  noteSize,
  borderSize,
  accumulatedBlockLength,
  split,
  notes,
}: ChartBlockRectangleProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [indicatorTop, setIndicatorTop] = useState<number>(0);
  const zoomIdx: number = useRecoilValue<number>(zoomIdxState);

  const onMouseMove = (event: React.MouseEvent<HTMLSpanElement>) => {
    // 譜面のブロックのマウスホバーした際に、マウスの行インデックスの場所にインディケーターを表示
    // 譜面のブロックのマウスホバーが外れた際に、インディケーターを非表示
    const y: number = Math.floor(
      event.clientY - event.currentTarget.getBoundingClientRect().top
    );
    if (y < blockHeight) {
      const distance: number = (2.0 * noteSize * ZOOM_VALUES[zoomIdx]) / split;
      const indicatorTopOffset: number = borderSize;
      setIndicatorTop(y - (y % distance) - indicatorTopOffset);
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  };

  const imgs: React.ReactNode[] = useMemo(() => {
    let imgTopOffset: number = borderSize + (isHovered ? noteSize : 0);
    return notes.reduce((prev: React.ReactNode[], note: Note) => {
      // 単ノート/ホールド/中抜きホールドの始点
      prev.push(
        <img
          key={note.start}
          src={NOTE_SRCS[column % 5]}
          alt={`note${column % 5}`}
          width={noteSize}
          height={noteSize}
          style={{
            position: "relative",
            top: `${
              (2.0 *
                noteSize *
                ZOOM_VALUES[zoomIdx] *
                (note.start - accumulatedBlockLength)) /
                split -
              imgTopOffset
            }px`,
            zIndex: (note.start + 1) * 10,
          }}
        />
      );
      imgTopOffset = imgTopOffset + noteSize;

      if (note.start !== note.goal) {
        // ホールド/中抜きホールド
        // TODO: 中抜きホールドの中間にかぶせる部分のみ表示し、かぶせない部分は半透明にする
        const holdHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoomIdx] * (note.goal - note.start)) /
          split;
        prev.push(
          <img
            key={(note.start + note.goal) / 2}
            src={HOLD_SRCS[column % 5]}
            alt={`hold${column % 5}`}
            width={noteSize}
            height={holdHeight}
            style={{
              position: "relative",
              top: `${
                (2.0 *
                  noteSize *
                  ZOOM_VALUES[zoomIdx] *
                  (note.start - accumulatedBlockLength)) /
                  split +
                noteSize * 0.5 -
                imgTopOffset
              }px`,
              zIndex: (note.start + 1) * 10 + 1,
            }}
          />
        );
        imgTopOffset = imgTopOffset + holdHeight;

        // ホールド/中抜きホールドの終点
        prev.push(
          <img
            key={note.goal}
            src={NOTE_SRCS[column % 5]}
            alt={`note${column % 5}`}
            width={noteSize}
            height={noteSize}
            style={{
              position: "relative",
              top: `${
                (2.0 *
                  noteSize *
                  ZOOM_VALUES[zoomIdx] *
                  (note.goal - accumulatedBlockLength)) /
                  split -
                imgTopOffset
              }px`,
              zIndex: (note.start + 1) * 10 + 2,
            }}
          />
        );
        imgTopOffset = imgTopOffset + noteSize;
      }

      return prev;
    }, []);
  }, [
    borderSize,
    isHovered,
    noteSize,
    notes,
    column,
    accumulatedBlockLength,
    split,
    zoomIdx,
  ]);

  return (
    <span
      style={{
        display: "block",
        width: `${noteSize}px`,
        height: `${blockHeight}px`,
        backgroundColor: isEvenIdx
          ? "rgb(255, 255, 170)"
          : "rgb(170, 255, 255)",
        lineHeight: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={onMouseMove}
    >
      <ChartBorderLine
        style={{
          position: "relative",
          top: `${blockHeight - borderSize}px`,
          width: `${noteSize}px`,
          height: `${borderSize}px`,
        }}
      />
      {isHovered && (
        <span
          style={{
            display: "block",
            position: "relative",
            top: `${indicatorTop}px`,
            width: `${noteSize}px`,
            height: `${noteSize}px`,
            backgroundColor: "rgba(170, 170, 170, 0.5)",
          }}
        />
      )}
      {imgs}
    </span>
  );
}

export default memo(ChartBlockRectangle);
