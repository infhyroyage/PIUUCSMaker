import { memo, useMemo, useState } from "react";
import { ChartBlockRectangleProps } from "../types/props";
import { Chart, Note } from "../types/ucs";
import { useRecoilValue } from "recoil";
import { chartState, zoomIdxState } from "../service/atoms";
import { ZOOM_VALUES } from "../service/zoom";
import ChartBorderLine from "./ChartBorderLine";
import { Theme, useTheme } from "@mui/material";
import useEditNotes from "../hooks/useEditNotes";
import { IMAGE_BINARIES } from "../service/images";

function ChartBlockRectangle({
  blockIdx,
  column,
  accumulatedBlockLength,
  split,
  blockHeight,
  noteSize,
  borderSize,
}: ChartBlockRectangleProps) {
  // インディケーターを表示する場合はそのtop値、表示しない場合はnull
  const [indicatorTop, setIndicatorTop] = useState<number | null>(null);
  const [mouseDownRowIdx, setMouseDownRowIdx] = useState<number | null>(null);
  const chart: Chart | null = useRecoilValue<Chart | null>(chartState);
  const zoomIdx: number = useRecoilValue<number>(zoomIdxState);

  const theme: Theme = useTheme();

  const { editNotes } = useEditNotes();

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
      setIndicatorTop(null);
    }
  };

  const onMouseDown = () => {
    // 押下した瞬間にインディケーターが非表示である場合はNOP
    if (indicatorTop === null) return;

    // 押下した譜面全体での行インデックスを保持
    const indicatorTopOffset: number = borderSize;
    setMouseDownRowIdx(
      accumulatedBlockLength +
        ((indicatorTop + indicatorTopOffset) * split) /
          (2.0 * noteSize * ZOOM_VALUES[zoomIdx])
    );
  };

  const onMouseUp = () => {
    // 押下を離した瞬間にインディケーターが非表示である/押下した譜面全体での行インデックスが初期値の場合はNOP
    if (indicatorTop === null || mouseDownRowIdx === null) return;

    // 押下を離した瞬間での譜面全体での行インデックスmouseUpRowIdxを取得
    const indicatorTopOffset: number = borderSize;
    const mouseUpRowIdx: number =
      accumulatedBlockLength +
      ((indicatorTop + indicatorTopOffset) * split) /
        (2.0 * noteSize * ZOOM_VALUES[zoomIdx]);

    // 単ノート/(中抜き)ホールドの追加・削除
    editNotes(blockIdx, column, mouseDownRowIdx, mouseUpRowIdx);

    // 保持していた押下した譜面全体での行インデックスを初期化
    setMouseDownRowIdx(null);
  };

  const imgs: React.ReactNode[] = useMemo(() => {
    if (chart === null) return [];

    let imgTopOffset: number =
      borderSize + (indicatorTop === null ? 0 : noteSize);
    return chart.blocks[blockIdx].notes[column].reduce(
      (prev: React.ReactNode[], note: Note) => {
        // 単ノート/ホールド/中抜きホールドの始点
        prev.push(
          <img
            key={note.start}
            src={IMAGE_BINARIES[column % 5].note}
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
              src={IMAGE_BINARIES[column % 5].hold}
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
                zIndex: (note.start + 1) * 10 + 2,
              }}
            />
          );
          imgTopOffset = imgTopOffset + holdHeight;

          // ホールド/中抜きホールドの終点
          prev.push(
            <img
              key={note.goal}
              src={IMAGE_BINARIES[column % 5].note}
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
                zIndex: (note.start + 1) * 10 + 1,
              }}
            />
          );
          imgTopOffset = imgTopOffset + noteSize;
        }

        return prev;
      },
      []
    );
  }, [
    borderSize,
    indicatorTop,
    noteSize,
    blockIdx,
    column,
    chart,
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
      onMouseLeave={() => setIndicatorTop(null)}
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
      {indicatorTop !== null && (
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
