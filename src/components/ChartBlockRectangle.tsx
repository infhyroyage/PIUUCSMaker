import { memo, useMemo } from "react";
import { ChartBlockRectangleProps } from "../types/props";
import Note0 from "../images/note0.png";
import Note1 from "../images/note1.png";
import Note2 from "../images/note2.png";
import Note3 from "../images/note3.png";
import Note4 from "../images/note4.png";
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

  const imgSrc: string | undefined = useMemo(() => {
    switch (column % 5) {
      case 0:
        // 単ノート(左下)
        return Note0;
      case 1:
        // 単ノート(左上)
        return Note1;
      case 2:
        // 単ノート(中央)
        return Note2;
      case 3:
        // 単ノート(右上)
        return Note3;
      case 4:
        // 単ノート(右下)
        return Note4;
      default:
        // 内部矛盾
        return undefined;
    }
  }, [column]);

  return (
    <span
      style={{
        display: "inline-block",
        width: `${noteSize}px`,
        height: "100%",
        backgroundColor: isEvenIdx ? "#ffffaa" : "#aaffff",
        marginRight: `${borderSize}px`,
        lineHeight: 0,
        zIndex: 1,
      }}
    >
      {notes.map((note: Note, idx: number) => (
        <img
          key={note.start}
          src={imgSrc}
          alt={`note${column % 5}`}
          width={noteSize}
          height={noteSize}
          style={{
            position: "relative",
            top: `${
              (2.0 * noteSize * ZOOM_VALUES[zoomIdx] * (note.start - idx)) /
              split
            }px`,
            zIndex: (accumulatedBlockLength + note.start + 1) * 10,
          }}
        />
      ))}
    </span>
  );
}

export default memo(ChartBlockRectangle);
