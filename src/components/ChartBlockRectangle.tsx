import { memo, useMemo } from "react";
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

function ChartBlockRectangle({
  column,
  isEvenIdx,
  noteSize,
  borderSize,
  accumulatedBlockLength,
  split,
  notes,
}: ChartBlockRectangleProps) {
  const zoomIdx: number = useRecoilValue<number>(zoomIdxState);

  const imgSrc: { note?: string; hold?: string } = useMemo(() => {
    switch (column % 5) {
      case 0:
        // 単ノート(左下)
        return { note: Note0, hold: Hold0 };
      case 1:
        // 単ノート(左上)
        return { note: Note1, hold: Hold1 };
      case 2:
        // 単ノート(中央)
        return { note: Note2, hold: Hold2 };
      case 3:
        // 単ノート(右上)
        return { note: Note3, hold: Hold3 };
      case 4:
        // 単ノート(右下)
        return { note: Note4, hold: Hold4 };
      default:
        // 内部矛盾
        return {};
    }
  }, [column]);

  let offset: number = 0;
  const imgs: React.ReactNode = notes.reduce(
    (prev: React.ReactNode[], note: Note) => {
      // 単ノート/ホールド/中抜きホールドの始点
      prev.push(
        <img
          key={note.start}
          src={imgSrc.note}
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
              offset
            }px`,
            zIndex: (note.start + 1) * 10,
          }}
        />
      );
      offset = offset + noteSize;

      if (note.start !== note.goal) {
        // ホールド/中抜きホールド
        // TODO: 中抜きホールドの中間にかぶせる部分のみ表示し、かぶせない部分は半透明にする
        const holdHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoomIdx] * (note.goal - note.start)) /
          split;
        prev.push(
          <img
            key={(note.start + note.goal) / 2}
            src={imgSrc.hold}
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
                offset
              }px`,
              zIndex: (note.start + 1) * 10 + 1,
            }}
          />
        );
        offset = offset + holdHeight;

        // ホールド/中抜きホールドの終点
        prev.push(
          <img
            key={note.goal}
            src={imgSrc.note}
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
                offset
              }px`,
              zIndex: (note.start + 1) * 10 + 2,
            }}
          />
        );
        offset = offset + noteSize;
      }

      return prev;
    },
    []
  );

  return (
    <span
      style={{
        display: "inline-block",
        width: `${noteSize}px`,
        height: "100%",
        backgroundColor: isEvenIdx ? "#ffffaa" : "#aaffff",
        marginRight: `${borderSize}px`,
        lineHeight: 0,
      }}
    >
      {imgs}
    </span>
  );
}

export default memo(ChartBlockRectangle);
