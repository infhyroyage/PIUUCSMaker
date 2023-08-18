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
import { Block, Chart, Note } from "../types/ucs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chartState,
  isShownSystemErrorSnackbarState,
  zoomIdxState,
} from "../service/atoms";
import { ZOOM_VALUES } from "../service/zoom";
import ChartBorderLine from "./ChartBorderLine";
import { Theme, useTheme } from "@mui/material";

// 単ノート・ホールドの画像ファイルのバイナリデータ
const NOTE_SRCS: string[] = [Note0, Note1, Note2, Note3, Note4];
const HOLD_SRCS: string[] = [Hold0, Hold1, Hold2, Hold3, Hold4];

function ChartBlockRectangle({
  column,
  blockIdx,
  blockHeight,
  noteSize,
  borderSize,
  accumulatedBlockLength,
  split,
  notes,
}: ChartBlockRectangleProps) {
  // インディケーターを表示する場合はtop値、表示しない場合はundefined
  const [indicatorTop, setIndicatorTop] = useState<number | undefined>(
    undefined
  );
  const [chart, setChart] = useRecoilState<Chart | undefined>(chartState);
  const zoomIdx: number = useRecoilValue<number>(zoomIdxState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const theme: Theme = useTheme();

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
    } else {
      setIndicatorTop(undefined);
    }
  };

  const onMouseDown = () => {
    // 押下した瞬間での譜面全体での行インデックスを保持
    // TODO: 上記未実装のためNOP
  };

  const onMouseUp = () => {
    // 押下を離した瞬間にインディケーターが非表示である場合、
    // 保持した押下した瞬間での譜面全体での行インデックスを初期化のみ行う
    // TODO: 上記未実装のためNOP
    if (typeof indicatorTop === "undefined") return;

    // 押下を離した瞬間での譜面全体での行インデックスmouseUpRowを取得
    const indicatorTopOffset: number = borderSize;
    const mouseUpRow: number =
      accumulatedBlockLength +
      ((indicatorTop + indicatorTopOffset) * split) /
        (2.0 * noteSize * ZOOM_VALUES[zoomIdx]);

    // mouseUpRowの場所に単ノート/(中抜き)ホールドを含む場合は、その単ノート/(中抜き)ホールドを削除し、
    // 含まない場合は、mouseUpRowの場所に単ノート/ホールドを譜面に追加
    // TODO: ホールドの追加は未実装
    let updatedColumnNotes: Note[] = [...notes];
    const noteIdx: number = notes.findIndex(
      (note: Note) => note.start <= mouseUpRow && mouseUpRow <= note.goal
    );
    if (noteIdx === -1) {
      updatedColumnNotes.push({
        start: mouseUpRow,
        goal: mouseUpRow,
        hollowStarts: [],
        hollowGoals: [],
      });
    } else {
      updatedColumnNotes = [
        ...notes.slice(0, noteIdx),
        ...notes.slice(noteIdx + 1),
      ];
    }

    // 譜面の更新
    if (!chart) {
      setIsShownSystemErrorSnackbar(true);
      return;
    }
    setChart({
      ...chart,
      blocks: chart.blocks.map((block: Block, i: number) =>
        i === blockIdx
          ? {
              ...block,
              notes: block.notes.map((columnNotes: Note[], j: number) =>
                j === column ? updatedColumnNotes : columnNotes
              ),
            }
          : block
      ),
    });
  };

  const imgs: React.ReactNode[] = useMemo(() => {
    let imgTopOffset: number =
      borderSize + (typeof indicatorTop === "undefined" ? 0 : noteSize);
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
    indicatorTop,
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
        backgroundColor:
          blockIdx % 2 === 0 ? "rgb(255, 255, 170)" : "rgb(170, 255, 255)",
        lineHeight: 0,
      }}
      onMouseLeave={() => setIndicatorTop(undefined)}
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
      {typeof indicatorTop !== "undefined" && (
        <span
          style={{
            display: "block",
            position: "relative",
            top: `${indicatorTop}px`,
            width: `${noteSize}px`,
            height: `${noteSize}px`,
            backgroundColor: "rgba(170, 170, 170, 0.5)",
            zIndex: theme.zIndex.drawer - 1,
          }}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
      )}
      {imgs}
    </span>
  );
}

export default memo(ChartBlockRectangle);
